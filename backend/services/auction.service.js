const storage = require("../storage/storage");
const { auction } = require("../models/auction");
const notificationController = require("../controllers/notification.controller");
const { bid } = require("../models/bid");
class AuctionService {
  #activeAuctionsObserverInterval;

  async activeAuctionsObserver() {
    console.log("started observer");
    if (this.#activeAuctionsObserverInterval)
      clearInterval(this.#activeAuctionsObserverInterval);
    this.#activeAuctionsObserverInterval = setInterval(
      () => this.#checkActiveAuctions(),
      2000
    );
  }

  async #checkActiveAuctions() {
    const auctions = await auction.find({ status: "active" });
    if (auctions.length === 0) return;

    for (const auc of auctions) {
      if (new Date(auc.endTime).getTime() > new Date().getTime()) continue;
      console.log(`Аукцион ${auc._id} завершился, определяем победителя...`);

      let winner = await this.selectAuctionWinner(auc);
      if (!winner) continue;

      const populatedBid = await bid.findById(winner._id).populate("user");

      auc.status = "waitingForPay";
      await auc.save();

      console.log(`Победитель: ${populatedBid?.user?.name} (${populatedBid?.user?.email}). Ожидание оплаты...`);

      const connections = storage.get("auctionConnections").get(auc.hash) || [];
      if (connections) {
        connections.forEach((ws) => {
          if (ws.readyState === 1)
            ws.send(
              JSON.stringify({
                type: "auctionEnded",
                status: auc.status,
                winner: winner?.user,
              })
            );
        });
      }
      this.startPaymentCheckInterval(auc, winner);

      const escapeMarkdownV2 = (text) => String(text).replace(/([\\`*_\[\]()~<>#+\-=|{}.!])/g, "\\$1");
      const message = `⚡️ *Auction Ended*\n\n🛒 *Auction:*\n■ *${escapeMarkdownV2(auc.title)}*\n\n*Current price:* ${escapeMarkdownV2(auc.currentPrice.toFixed(4))} BTC\n*Auction ID:* ${escapeMarkdownV2(auc._id)}\n*Total bids:* *${escapeMarkdownV2(auc.bids.length)}*\n*Winner:* ${escapeMarkdownV2(winner?.user || "Unknown")}\n\n👤 *Winner Details:*\n *Nickname:* ${escapeMarkdownV2(populatedBid?.user?.name || "Unknown")}\n *Email:* \`${escapeMarkdownV2(populatedBid?.user?.email || "No Email")}\`\n\n *Status:* ${escapeMarkdownV2(auc.status)}`;

      setImmediate(async () => {
          try {
              await Promise.all([
                  notificationController.sendTelegramNotification(message, 2),
                  notificationController.sendAuctionEndEmails(auc, populatedBid)
              ]);
          } catch (error) {
              console.error("Error sending notifications:", error);
          }
      });
    }
  }

  startPaymentCheckInterval(auc, winner) {
    let attempts = 0;
    const interval = setInterval(async () => {
      const updatedAuc = await auction.findById(auc._id);
      attempts++;
      console.log(`Проверка ${attempts}/24. Статус: ${updatedAuc.status}`);

      if (["completed", "waitingForConfirmation"].includes(updatedAuc.status)) {
        console.log(`Аукцион ${auc._id} завершен. Проверки остановлены.`);
        clearInterval(interval);
        return;
      }

      if (attempts >= 24) {
        console.log(
          `Оплата не поступила за 24 часа. Выбираем нового победителя...`
        );
        if (!updatedAuc.blackList.includes(winner.user)) {
          updatedAuc.blackList.push(winner.user);
        }

        let newWinner = await this.selectAuctionWinner(updatedAuc);
        if (newWinner) {
          console.log(`Новый победитель: ${newWinner.user}`);
          updatedAuc.status = "waitingForPay";
        } else {
          console.log(`Нет других ставок. Аукцион завершен без победителя.`);
          updatedAuc.status = "failed";
        }
        await updatedAuc.save();
        clearInterval(interval);
      }
    }, 60 * 60 * 1000);
  }

  async selectAuctionWinner(auc, blackList = []) {
    const populatedAuction = await auction.findById(auc._id).populate("bids");

    if (!populatedAuction || populatedAuction.bids.length === 0) {
      console.log(`Аукцион ${auc._id} не имеет ставок.`);
      populatedAuction.status = 'failed';
      await populatedAuction.save();
      return null;
    }

    const validBids = populatedAuction.bids.filter(
      (bid) => !blackList.includes(bid.user.toString())
    );

    if (validBids.length === 0) {
      console.log(`Все участники аукциона ${auc._id} в черном списке.`);
      return null;
    }

    return validBids.reduce(
      (winner, bid) => (bid.amount > winner.amount ? bid : winner),
      { amount: 0 }
    );
  }

  async paymentForAuction() {
    return true;
  }

  async getAuctions(req, res) {
    const result = await auction.find().populate("winner");
    res.json(result);
  }

  async updateAuction(auc) {
    console.log(auc._id);
    const existingAuc = await auction.findById(auc._id);
    const newAuc = await auction.findByIdAndUpdate(
      auc._id,
      { $set: { status: auc.status, blackList: auc.blackList } },
      { new: true }
    );

    if (!newAuc.bids.length && existingAuc.bids.length) {
      newAuc.bids = existingAuc.bids;
      await newAuc.save();
    }

    storage.get("auctions").set(auc._id, newAuc);
    return newAuc;
  }

  handleWs(ws, aucId) {
    this.onConnection();
    ws.on("close", () => this.onClose(aucId, ws));
  }

  onConnection(aucId, ws) {
    console.log("connected");
    const connections = storage.get("auctionConnections");
    const existingConnections = connections.get(aucId) || [];
    connections.set(aucId, [...existingConnections, ws]);

    console.log(
      `New WebSocket connection for auction ${aucId}. Total connections: ${
        connections.get(aucId).length
      }`
    );
  }

  onClose(aucId, ws) {
    console.log("closed");
    const connections = storage.get("auctionConnections");
    const filtered = (connections.get(aucId) || []).filter(
      (socket) => socket !== ws
    );
    connections.set(aucId, filtered);
    console.log(
      `WebSocket connection closed for auction ${aucId}. Remaining connections: ${filtered.length}`
    );
  }
}
module.exports = new AuctionService();
