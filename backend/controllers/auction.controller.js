const { auction } = require("../models/auction");
const { user } = require("../models/users");
const { bid } = require("../models/bid");
const storage = require("../storage/storage");
const auctionService = require("../services/auction.service");
const bidService = require("../services/bid.service");

const path = require("path");
const productService = require("../services/product.service");
const notificationController = require("./notification.controller");
const { compressVideo, deleteFile } = require("../utils/videoUtils");

const fs = require('fs')
const compressedDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

class AuctionController {
  async getAuctions(req, res) {
    try {
      const auctions = await auction
        .find({})
        .populate("bids")
        .sort({ createdAt: -1 });
      res.status(200).json(auctions);
    } catch (e) {
      console.log(e);
      res.status(500).send("error caused");
    }
  }

  async getOneAuction(req, res) {
    try {
      const result = await auction
        .findOne({ hash: req.params.id })
        .populate("bids");
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).send("not found");
    }
  }

  async postAuction(req, res) {
    try {
      const imgUrls = await productService.uploadImage(req.body.images);
      console.log(imgUrls);

      delete req.body.images;
      if (imgUrls) req.body.images = imgUrls;

      let videoFilename = null;

      if (req.file) {
        console.log("Uploaded video:", req.file.path);

        const compressedPath = path.join(compressedDir, req.file.filename);
        await compressVideo(req.file.path, compressedPath);

        console.log("Video compressed:", req.file.filename);

        deleteFile(req.file.path);

        videoFilename = req.file.filename;
      }

      req.body.video = videoFilename;
      let result = await auction.insertMany(req.body);
      result.forEach((item) => storage.get("auctions").set(item._id, item));
      console.log(storage);
      res.status(201).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).send("error caused");
    }
  }

  async updateAuction(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      if (updatedData.images && typeof updatedData.images === "string")
        updatedData.images = JSON.parse(updatedData.images);

      const existingAuction = await auction.findById(id);
      if (!existingAuction)
        return res.status(404).json({ message: "Auction not found" });

      if (req.file) {
        console.log("Uploaded new video:", req.file.path);

        if (existingAuction.video) {
          const oldVideoPath = path.join(compressedDir, existingAuction.video);
          deleteFile(oldVideoPath);
        }

        const compressedPath = path.join(compressedDir, req.file.filename);
        await compressVideo(req.file.path, compressedPath);
        deleteFile(req.file.path);

        updatedData.video = req.file.filename;
      } else updatedData.video = existingAuction.video;

      const updatedAuction = await auction.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      res.status(200).json(updatedAuction);
    } catch (e) {
      console.error(e);
      res.status(500).send("error caused");
    }
  }

  async deleteAuction(req, res) {
    try {
      const auctionToDelete = await auction.findById(req.params.id);

      if (!auctionToDelete) {
        return res.status(404).json({ message: "Auction not found" });
      }

      if (auctionToDelete.video) {
        const videoPath = path.join(compressedDir, auctionToDelete.video);
        deleteFile(videoPath);
      }

      await auction.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Auction deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error occurred while deleting auction");
    }
  }

  async placeBet(req, res) {
    try {
      const { userId, amount, auctionId, name } = req.body;
  
      const auc = await auction.findById(auctionId).populate({
        path: "bids",
        populate: { path: "user", select: "name" },
      });
      if (!auc) return res.status(404).send("Auction not found");
  
      if (
        amount <= auc.currentPrice ||
        amount <= auc.minPrice ||
        amount > auc.maxPrice
      ) {
        return res.status(400).send("Bid must be greater than the current price and minimum price");
      }
  
      const usr = await user.findById(userId);
      if (!usr) return res.status(404).send("User not found");
  
      const lastBid = auc.bids.length ? auc.bids[auc.bids.length - 1] : null;
      if (lastBid && usr.name === lastBid.user.name)
        return res.status(400).send("User already placed a bid");
  
      if (!usr.name && name) {
        usr.name = name;
        await usr.save();
      }
  
      const newBid = await bidService.createBid({
        user: userId,
        amount,
        auction: auctionId
      });
  
      auc.currentPrice = amount;
      auc.bids.push(newBid._id);
      await auc.save();
  
      usr.bids.push(newBid._id);
      await usr.save();
  
      const populatedBid = await bid.findById(newBid._id).populate({
        path: "user",
        select: "name",
      });
  
      const connections = storage.get("auctionConnections").get(auc.hash);
      if (connections) {
        connections.forEach((ws) => {
          if (ws.readyState === 1)
            ws.send(JSON.stringify({ type: "newBid", bid: populatedBid }));
        });
      }
  
      const auctionEndDate = new Date(auc.endTime);
      const timeLeft = auctionEndDate - new Date();
  
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
      const auctionTimeLeft = `${hours}h ${minutes}m ${seconds}s`;
  
      const escapeMarkdownV2 = (text) => {
        return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
      };
  
      const message = `⚡️ *New Bid*\n\n🛒 *Auction:*\n■ *${escapeMarkdownV2(auc.title)}*\n\n*Current price:* ${escapeMarkdownV2(auc.currentPrice.toFixed(4))} BTC\n*Auction ID:* ${escapeMarkdownV2(auc._id)}\n*Total bids:* *${escapeMarkdownV2(auc.bids.length)}*\n*Bid:* ${escapeMarkdownV2(populatedBid.amount.toFixed(4))} BTC\n\n👤 *Bidder Details:*\n *Nickname:* ${escapeMarkdownV2(populatedBid.user.name)}\n *Email:* ${escapeMarkdownV2(usr.email)}\n *User ID:* ${escapeMarkdownV2(usr._id)}\n\n⏳ *Auction ends in* ${escapeMarkdownV2(auctionTimeLeft)}`;

      setImmediate(async () => {
        try {
            await Promise.all([
                notificationController.placedBidUser(auc, populatedBid, usr, auctionTimeLeft),
                notificationController.sendTelegramNotification(message, 1),
                notificationController.sendBidEmails(auc, populatedBid, usr, auctionTimeLeft)
            ]);
          } catch (error) {
              console.error("Error sending notifications:", error);
          }
        });
  
      res.status(201).json({
        auction: auc,
        bid: populatedBid,
      });
    } catch (e) {
      console.error("Error placing bid:", e);
      res.status(500).send("Failed to place bid");
    }
  }

  async getBids(req, res) {
    try {
      const { hash } = req.params;
      const { page = 1, limit = 5 } = req.query;

      const auc = await auction.findOne({ hash }).populate({
        path: "bids",
        populate: {
          path: "user",
          select: "name",
        },
        options: {
          sort: { date: -1 },
          skip: (page - 1) * limit,
          limit: parseInt(limit),
        },
      });

      if (!auc) return res.status(404).send("Auction not found");

      res.status(200).json(auc.bids);
    } catch (e) {
      console.error("Error fetching paginated bids:", e);
      res.status(500).send("Failed to fetch bids");
    }
  }

  joinAuction(ws) {
    this.connections.set(connectionId, ws);
    this.connectionId++;
    console.log(this.connections, "a?");
  }

  handleWs(ws, req) {
    const auctionId = req.params.id;

    auctionService.onConnection(auctionId, ws);
    ws.send(
      JSON.stringify({ type: "connected", message: "Welcome to the auction!" })
    );

    ws.on("message", (message) => {
      console.log("Received message from client:", message);
    });

    ws.on("close", () => {
      auctionService.onClose(auctionId, ws);
    });
  }
}

module.exports = new AuctionController();
