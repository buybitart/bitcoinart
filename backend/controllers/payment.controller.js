const crypto = require("crypto");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const axios = require("axios");
const { order } = require("../models/order");
const { user } = require("../models/users");
const { auction } = require("../models/auction");
const notificationController = require("./notification.controller");
const { product } = require("../models/product");
const { galleryProduct } = require("../models/galleryProduct");

class PaymentController {
  async createInvoiceBTC(req, res, next) {
    try {
      const { itemsPurchased, userId } = req.body;

      if (!itemsPurchased?.length)
        return res.status(500).json({
          success: false,
          message: "Provide required data: itemsPurchased.",
        });
      if (!userId)
        return res.status(500).json({
          success: false,
          message: "Create or login to your account.",
        });

      const totalPrice = itemsPurchased.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );

      let orderId = crypto.randomUUID();
      const invoiceData = {
        metadata: {
          orderId,
          itemDesc: "5KSANA Shop",
        },
        checkout: {
          redirectURL: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
        },
        amount: totalPrice,
        currency: "BTC",
        paymentMethods: ["BTC"],
      };

      const response = await axios.post(
        `${process.env.BTCPAY_URL}/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${process.env.BTCPAY_API_KEY}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const { checkoutLink, id: invoiceId } = response.data;
        console.log(response.data);

        const foundUser = await user.findById(userId);
        if (!foundUser)
          return res
            .status(500)
            .json({ success: false, message: "User not found." });

        const newOrder = await order.create({
          items: itemsPurchased.map((item) => ({
            title: item.title,
            product: item._id,
            productType: "Product",
            price: item.price,
            quantity: item.quantity || 1,
          })),
          totalPrice,
          payer: userId,
          status: "processing",
          payProcessor: "BTCPay Server",
          orderId,
          invoiceId,
        });

        foundUser.orders.push(newOrder._id);
        await foundUser.save();

        const escapeMarkdownV2 = (text) => {
          return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
        };

        const message = `⚡️ *New Order*\n\n🛒 *Items:*\n■ *${newOrder.items.map(item => `${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2(newOrder.totalPrice.toFixed(4))} BTC\`\n*Order ID:* \`${escapeMarkdownV2(newOrder.orderId)}\`\n*Status:* 🟨 *${escapeMarkdownV2(newOrder.status)}*\n*PayProcessor:* *BTCPay Server*\n\n📍 *Shipping Address:*\n ${escapeMarkdownV2(req.body.country)}, ${escapeMarkdownV2(req.body.city)}, ${escapeMarkdownV2(req.body.street)}, ${escapeMarkdownV2(req.body.zip)}\n\n👤 *Buyer Details:*\n *Full name:* ${escapeMarkdownV2(req.body.firstname)} ${escapeMarkdownV2(req.body.lastname)}\n *Email:* \`${escapeMarkdownV2(foundUser.email)}\`\n *Phone:* \`${escapeMarkdownV2(req.body.phone)}\`\n\n ${req.body.notes ? `*Notes:* ${escapeMarkdownV2(req.body.notes)}\n` : ""}`;

        setImmediate(async () => {
          try {
            await Promise.all([
              notificationController.sendBoughtArt(
                newOrder,
                req.body,
                "BTCPay Server (BTC)"
              ),
              notificationController.sendTelegramNotification(message, 0),
              notificationController.sendOrderEmails(
                newOrder,
                req.body,
                foundUser.email,
                "product",
                "BTCPay Server (BTC)"
              ),
            ]);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        return res.json({ success: true, checkoutLink });
      }
    } catch (error) {
      console.error("BTCPay error:", error.response?.data || error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error creating invoice" });
    }
  }

  async createInvoiceBTCAuction(req, res, next) {
    try {
      const { itemsPurchased, userId } = req.body;

      if (!userId)
        return res.status(500).json({
          success: false,
          message: "Create or login to your account.",
        });

      const totalPrice = itemsPurchased.currentPrice;

      let orderId = crypto.randomUUID();

      const invoiceData = {
        metadata: {
          orderId,
          itemDesc: "5KSANA Shop",
        },
        checkout: {
          redirectURL: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
        },
        amount: totalPrice,
        currency: "BTC",
        paymentMethods: ["BTC"],
      };

      const response = await axios.post(
        `${process.env.BTCPAY_URL}/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${process.env.BTCPAY_API_KEY}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const { checkoutLink, id: invoiceId } = response.data;
        console.log(response.data);

        const foundUser = await user.findById(userId);
        if (!foundUser)
          return res
            .status(500)
            .json({ success: false, message: "User not found." });

        const newOrder = await order.create({
          items: [
            {
              title: itemsPurchased.title,
              product: itemsPurchased._id,
              productType: "Auction",
              price: itemsPurchased.currentPrice,
              quantity: itemsPurchased.quantity || 1,
            },
          ],
          totalPrice,
          payer: userId,
          status: "processing",
          payProcessor: "BTCPay Server",
          orderId,
          invoiceId,
        });

        foundUser.orders.push(newOrder._id);
        await foundUser.save();

        const escapeMarkdownV2 = (text) => {
          return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
        };

        const message = `⚡️ *New Order ${escapeMarkdownV2("(Auction)")}*\n\n🛒 *Items:*\n■ *${newOrder.items.map((item) =>`${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2(newOrder.totalPrice.toFixed(4))} BTC\`\n*Order ID:* \`${escapeMarkdownV2(newOrder.orderId)}\`\n*Status:* 🟨 *${escapeMarkdownV2(newOrder.status)}*\n*PayProcessor:* *BTCPay Server*\n\n📍 *Shipping Address:*\n ${escapeMarkdownV2(req.body.country)}, ${escapeMarkdownV2(req.body.city)}, ${escapeMarkdownV2(req.body.street)}, ${escapeMarkdownV2(req.body.zip)}\n\n👤 *Buyer Details:*\n *Full name:* ${escapeMarkdownV2(req.body.firstname)} ${escapeMarkdownV2(req.body.lastname)}\n *Email:* \`${escapeMarkdownV2(foundUser.email)}\`\n *Phone:* \`${escapeMarkdownV2(req.body.phone)}\`\n\n ${req.body.notes ? `*Notes:* ${escapeMarkdownV2(req.body.notes)}\n` : ""}`;

        setImmediate(async () => {
          try {
            await Promise.all([
              notificationController.sendBoughtArt(
                newOrder,
                req.body,
                "BTCPay Server (BTC)",
                "Auction"
              ),
              notificationController.sendTelegramNotification(message, 0),
              notificationController.sendOrderEmails(
                newOrder,
                req.body,
                foundUser.email,
                "auction",
                "BTCPay Server (BTC)"
              ),
            ]);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        return res.json({ success: true, checkoutLink });
      }
    } catch (error) {
      console.error("BTCPay error:", error.response?.data || error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error creating invoice" });
    }
  }

  async createInvoiceUSDT(req, res, next) {
    try {
      const { itemsPurchased, userId, btcPrice } = req.body;

      if (!itemsPurchased?.length)
        return res.status(500).json({
          success: false,
          message: "Provide required data: itemsPurchased.",
        });
      if (!userId)
        return res.status(500).json({
          success: false,
          message: "Create or login to your account.",
        });

      const totalPrice = Number(itemsPurchased.reduce(
        (total, item) => total + item.price * btcPrice * (item.quantity || 1),
        0
      ).toFixed(2));

      const rawTotal = itemsPurchased.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );

      let orderId = crypto.randomUUID();
      const invoiceData = {
        metadata: {
          orderId,
          itemDesc: "5KSANA Shop",
        },
        checkout: {
          redirectURL: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
        },
        amount: totalPrice,
        currency: "USDT",
        paymentMethods: ["USDT-TRON"],
      };

      const response = await axios.post(
        `${process.env.BTCPAY_URL}/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${process.env.BTCPAY_API_KEY}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const { checkoutLink, id: invoiceId } = response.data;
        console.log(response.data);

        const foundUser = await user.findById(userId);
        if (!foundUser)
          return res
            .status(500)
            .json({ success: false, message: "User not found." });

        const newOrder = await order.create({
          items: itemsPurchased.map((item) => ({
            title: item.title,
            product: item._id,
            productType: "Product",
            price: item.price,
            quantity: item.quantity || 1,
          })),
          totalPrice: rawTotal,
          payer: userId,
          status: "processing",
          payProcessor: "BTCPay Server",
          orderId,
          invoiceId,
        });

        foundUser.orders.push(newOrder._id);
        await foundUser.save();

        const escapeMarkdownV2 = (text) => {
          return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
        };

        const message = `⚡️ *New Order*\n\n🛒 *Items:*\n■ *${newOrder.items.map(item => `${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2((newOrder.totalPrice * btcPrice).toFixed(2))} USDT\`\n*Order ID:* \`${escapeMarkdownV2(newOrder.orderId)}\`\n*Status:* 🟨 *${escapeMarkdownV2(newOrder.status)}*\n*PayProcessor:* *BTCPay Server ${escapeMarkdownV2("(USDT)")}*\n\n📍 *Shipping Address:*\n ${escapeMarkdownV2(req.body.country)}, ${escapeMarkdownV2(req.body.city)}, ${escapeMarkdownV2(req.body.street)}, ${escapeMarkdownV2(req.body.zip)}\n\n👤 *Buyer Details:*\n *Full name:* ${escapeMarkdownV2(req.body.firstname)} ${escapeMarkdownV2(req.body.lastname)}\n *Email:* \`${escapeMarkdownV2(foundUser.email)}\`\n *Phone:* \`${escapeMarkdownV2(req.body.phone)}\`\n\n ${req.body.notes ? `*Notes:* ${escapeMarkdownV2(req.body.notes)}\n` : ""}`;

        setImmediate(async () => {
          try {
            await Promise.all([
              notificationController.sendBoughtArt(
                newOrder,
                req.body,
                "BTCPay Server (USDT)"
              ),
              notificationController.sendTelegramNotification(message, 0),
              notificationController.sendOrderEmails(
                newOrder,
                req.body,
                foundUser.email,
                "product",
                "BTCPay Server (USDT)"
              ),
            ]);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        return res.json({ success: true, checkoutLink });
      }
    } catch (error) {
      console.error(
        "BTCPay USDT error:",
        error.response?.data || error.message
      );
      return res
        .status(500)
        .json({ success: false, message: "Error creating USDT invoice" });
    }
  }

  async createInvoiceUSDTAuction(req, res, next) {
    try {
      const { itemsPurchased, userId, btcPrice } = req.body;

      if (!userId)
        return res.status(500).json({
          success: false,
          message: "Create or login to your account.",
        });

      const totalPrice = Number((itemsPurchased.currentPrice * btcPrice).toFixed(2));
      const rawTotal = itemsPurchased.currentPrice

      let orderId = crypto.randomUUID();
      const invoiceData = {
        metadata: {
          orderId,
          itemDesc: "5KSANA Shop",
        },
        checkout: {
          redirectURL: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
        },
        amount: totalPrice,
        currency: "USDT",
        paymentMethods: ["USDT-TRON"],
      };

      const response = await axios.post(
        `${process.env.BTCPAY_URL}/stores/${process.env.BTCPAY_STORE_ID}/invoices`,
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${process.env.BTCPAY_API_KEY}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const { checkoutLink, id: invoiceId } = response.data;
        console.log(response.data);

        const foundUser = await user.findById(userId);
        if (!foundUser)
          return res
            .status(500)
            .json({ success: false, message: "User not found." });

        const newOrder = await order.create({
          items: [
            {
            title: itemsPurchased.title,
            product: itemsPurchased._id,
            productType: "Auction",
            price: itemsPurchased.currentPrice,
            quantity: itemsPurchased.quantity || 1,
          }
          ],
          totalPrice: rawTotal,
          payer: userId,
          status: "processing",
          payProcessor: "BTCPay Server",
          orderId,
          invoiceId,
        });

        foundUser.orders.push(newOrder._id);
        await foundUser.save();

        const escapeMarkdownV2 = (text) => {
          return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
        };

        const message = `⚡️ *New Order*\n\n🛒 *Items:*\n■ *${newOrder.items.map(item => `${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2((newOrder.totalPrice * btcPrice).toFixed(2))} USDT\`\n*Order ID:* \`${escapeMarkdownV2(newOrder.orderId)}\`\n*Status:* 🟨 *${escapeMarkdownV2(newOrder.status)}*\n*PayProcessor:* *BTCPay Server ${escapeMarkdownV2("(USDT)")}*\n\n📍 *Shipping Address:*\n ${escapeMarkdownV2(req.body.country)}, ${escapeMarkdownV2(req.body.city)}, ${escapeMarkdownV2(req.body.street)}, ${escapeMarkdownV2(req.body.zip)}\n\n👤 *Buyer Details:*\n *Full name:* ${escapeMarkdownV2(req.body.firstname)} ${escapeMarkdownV2(req.body.lastname)}\n *Email:* \`${escapeMarkdownV2(foundUser.email)}\`\n *Phone:* \`${escapeMarkdownV2(req.body.phone)}\`\n\n ${req.body.notes ? `*Notes:* ${escapeMarkdownV2(req.body.notes)}\n` : ""}`;

        setImmediate(async () => {
          try {
            await Promise.all([
              notificationController.sendBoughtArt(
                newOrder,
                req.body,
                "BTCPay Server (USDT)",
                "Auction"
              ),
              notificationController.sendTelegramNotification(message, 0),
              notificationController.sendOrderEmails(
                newOrder,
                req.body,
                foundUser.email,
                "auction",
                "BTCPay Server (USDT)"
              ),
            ]);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        return res.json({ success: true, checkoutLink });
      }
    } catch (error) {
      console.error(
        "BTCPay USDT error:",
        error.response?.data || error.message
      );
      return res
        .status(500)
        .json({ success: false, message: "Error creating USDT invoice" });
    }
  }

  async webhookStatus(req, res, next) {
    try {
      const event = req.body;
      console.log("Webhook received:", event);

      const invoiceId = event.invoiceId;

      if (event.type === "InvoiceSettled") {
        console.log(`✅ Invoice ${invoiceId} was paid!`);

        const foundOrder = await order.findOne({ invoiceId }).populate("payer");
        if (!foundOrder) {
          return res.status(405);
        }

        foundOrder.status = "completed";
        await foundOrder.save();

        for (const item of foundOrder.items) {
          try {
            if (item.productType === "Product") {
              const oldProduct = await product.findById(item.product);
              if (!oldProduct) continue;
  
              const newGalleryProduct = new galleryProduct({
                ...oldProduct.toObject(),
                _id: item.product,
              });
  
              await newGalleryProduct.save();
              await product.deleteOne({ _id: item.product });
            } else if (item.productType === "Auction") {
              const oldAuction = await auction.findById(item.product);
              if (!oldAuction) continue;
  
              const newGalleryProduct = new galleryProduct({
                ...oldAuction.toObject(),
                _id: item.product,
              });
  
              await newGalleryProduct.save();
              await auction.deleteOne({ _id: item.product });
            }
          } catch (err) {
            console.error(`Failed to move product ${item.product} to gallery:`, err);
          }
        }

        const escapeMarkdownV2 = (text) => {
          return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
        };

        const message = `✅ *Order Status Updated ${foundOrder.productType === "Auction" ? escapeMarkdownV2("(Auction)") : ""}*\n\n🛒 *Items:*\n■ *${foundOrder.items.map((item) =>`${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2(foundOrder.totalPrice.toFixed(4))} BTC\`\n*Order ID:* \`${escapeMarkdownV2(foundOrder.orderId)}\`\n*Status:* ✅ *${escapeMarkdownV2(foundOrder.status)}*\n*PayProcessor:* *BTCPay Server*`;

        setImmediate(async () => {
          try {
            await Promise.all([
              notificationController.orderUpdated(foundOrder, foundOrder.payer, "BTCPay Server", foundOrder.productType),
              notificationController.sendTelegramNotification(message, 0),
              notificationController.orderUpdatedSelf(
                foundOrder,
                foundOrder.payer,
                "BTCPay Server",
                foundOrder.productType
              ),
            ]);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        return res.sendStatus(200);
      }

      if (event.type === "InvoiceExpired" || event.type === "InvoiceInvalid") {
        console.log(`❌ Invoice ${invoiceId} expired or failed.`);

        const foundOrder = await order.findOne({ invoiceId }).populate("payer");
        if (foundOrder) {
          foundOrder.status = "canceled";
          await foundOrder.save();
        }

        const escapeMarkdownV2 = (text) => {
          return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
        };

        const message = `❌ *Order Status Updated ${foundOrder.productType === "Auction" ? escapeMarkdownV2("(Auction)") : ""}*\n\n🛒 *Items:*\n■ *${foundOrder.items.map((item) =>`${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2(foundOrder.totalPrice.toFixed(4))} BTC\`\n*Order ID:* \`${escapeMarkdownV2(foundOrder.orderId)}\`\n*Status:* ❌ *${escapeMarkdownV2(foundOrder.status)}*\n*PayProcessor:* *BTCPay Server*`;

        setImmediate(async () => {
          try {
            await Promise.all([
              notificationController.orderUpdated(foundOrder, foundOrder.payer, "BTCPay Server", foundOrder.productType),
              notificationController.sendTelegramNotification(message, 0),
              notificationController.orderUpdatedSelf(
                foundOrder,
                foundOrder.payer,
                "BTCPay Server",
                foundOrder.productType
              ),
            ]);
          } catch (error) {
            console.error("Error sending notifications:", error);
          }
        });

        return res.sendStatus(200);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error("Webhook error:", error);
      if (!res.headersSent) res.status(500).send("Error processing webhook");
    }
  }

  async checkStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const foundOrder = await order.findOne({ orderId });

      if (!foundOrder) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found." });
      }

      return res.json({ success: true, status: foundOrder.status });
    } catch (error) {
      console.error("Error fetching order status:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async createPaymentIntent(req, res, next) {
    try {
      const { amount, userId } = req.body;

      if (!amount || !userId)
        return res
          .status(400)
          .json({ message: "Amount and userId are required." });

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: { userId },
        automatic_payment_methods: { enabled: true },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("Error creating Payment Intent:", error);
      res.status(500).json({ error: "Failed to create Payment Intent" });
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const { paymentIntentId, itemsPurchased, userId } = req.body;

      if (!paymentIntentId || !userId) {
        return res
          .status(400)
          .json({ message: "PaymentIntent ID and User ID are required." });
      }

      const foundUser = await user.findById(userId);
      if (!foundUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        const confirmedPayment = await stripe.paymentIntents.confirm(
          paymentIntentId
        );

        if (confirmedPayment.status !== "succeeded") {
          return res
            .status(400)
            .json({ message: "Payment failed or requires additional action." });
        }
      }

      const totalPrice = itemsPurchased.reduce(
        (total, item) =>
          total + (item.price || item.currentPrice) * (item.quantity || 1),
        0
      );

      let orderId = crypto.randomUUID();

      const newOrder = await order.create({
        items: itemsPurchased.map((item) => ({
          title: item.title,
          product: item._id,
          productType: "Product",
          price: item.price,
          quantity: item.quantity || 1,
        })),
        totalPrice,
        payer: userId,
        status: "completed",
        payProcessor: "Stripe",
        orderId,
      });

      foundUser.orders.push(newOrder._id);
      await foundUser.save();

      const escapeMarkdownV2 = (text) => {
        return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
      };

      const message = `⚡️ *New Order*\n\n🛒 *Items:*\n■ *${newOrder.items.map(item => `${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2(newOrder.totalPrice.toFixed(4))} BTC\`\n*Order ID:* \`${escapeMarkdownV2(newOrder.orderId)}\`\n*Status:* 🟨 *${escapeMarkdownV2(newOrder.status)}*\n*PayProcessor:* *BTCPay Server*\n\n📍 *Shipping Address:*\n ${escapeMarkdownV2(req.body.country)}, ${escapeMarkdownV2(req.body.city)}, ${escapeMarkdownV2(req.body.street)}, ${escapeMarkdownV2(req.body.zip)}\n\n👤 *Buyer Details:*\n *Full name:* ${escapeMarkdownV2(req.body.firstname)} ${escapeMarkdownV2(req.body.lastname)}\n *Email:* \`${escapeMarkdownV2(foundUser.email)}\`\n *Phone:* \`${escapeMarkdownV2(req.body.phone)}\`\n\n ${req.body.notes ? `*Notes:* ${escapeMarkdownV2(req.body.notes)}\n` : ""}`;

      setImmediate(async () => {
        try {
          await Promise.all([
            notificationController.sendBoughtArt(newOrder, req.body, "Stripe"),
            notificationController.sendTelegramNotification(message, 0),
            notificationController.sendOrderEmails(
              newOrder,
              req.body,
              foundUser.email,
              "product",
              "Stripe"
            ),
          ]);
          for (const item of itemsPurchased) {
            try {
              const oldProduct = await product.findById(item._id);
              if (!oldProduct) continue;
          
              const newGalleryProduct = new galleryProduct({
                ...oldProduct.toObject(),
                _id: item._id,
              });
          
              await newGalleryProduct.save();
              await product.deleteOne({ _id: item._id });
            } catch (err) {
              console.error(`Failed to move product ${item._id} to gallery:`, err);
            }
          }
        } catch (error) {
          console.error("Error sending notifications:", error);
        }
      });

      return res.json({
        message: "Payment confirmed!",
        paymentIntent,
        orderId,
        redirectUrl: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Payment confirmation failed", error });
    }
  }

  async confirmPaymentAuction(req, res, next) {
    try {
      const { paymentIntentId, itemsPurchased, userId } = req.body;

      if (!paymentIntentId || !userId) {
        return res
          .status(400)
          .json({ message: "PaymentIntent ID and User ID are required." });
      }

      const foundUser = await user.findById(userId);
      if (!foundUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      const auc = await auction.findById(itemsPurchased._id);

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        const confirmedPayment = await stripe.paymentIntents.confirm(
          paymentIntentId
        );

        if (confirmedPayment.status !== "succeeded") {
          return res
            .status(400)
            .json({ message: "Payment failed or requires additional action." });
        }
      }

      auc.status = "completed";
      await auc.save();

      const totalPrice = itemsPurchased.currentPrice;

      let orderId = crypto.randomUUID();

      const newOrder = await order.create({
        items: [
          {
            title: itemsPurchased.title,
            product: itemsPurchased._id,
            productType: "Auction",
            price: itemsPurchased.currentPrice,
            quantity: 1,
          },
        ],
        totalPrice,
        payer: userId,
        status: "completed",
        payProcessor: "Stripe",
        orderId,
      });

      foundUser.orders.push(newOrder._id);
      await foundUser.save();

      const escapeMarkdownV2 = (text) => {
        return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
      };

      const message = `⚡️ *New Order ${escapeMarkdownV2("(Auction)")}*\n\n🛒 *Items:*\n■ *${newOrder.items.map(item => `${escapeMarkdownV2(item.title)}* x${escapeMarkdownV2(item.quantity)}`).join("\n▪️ *")}\n\n*Total price:* \`${escapeMarkdownV2(newOrder.totalPrice.toFixed(4))} BTC\`\n*Order ID:* \`${escapeMarkdownV2(newOrder.orderId)}\`\n*Status:* ✅ *${escapeMarkdownV2(newOrder.status)}*\n*PayProcessor:* *Stripe*\n\n📍 *Shipping Address:*\n ${escapeMarkdownV2(req.body.country)}, ${escapeMarkdownV2(req.body.city)}, ${escapeMarkdownV2(req.body.street)}, ${escapeMarkdownV2(req.body.zip)}\n\n👤 *Buyer Details:*\n *Full name:* ${escapeMarkdownV2(req.body.firstname)} ${escapeMarkdownV2(req.body.lastname)}\n *Email:* \`${escapeMarkdownV2(foundUser.email)}\`\n *Phone:* \`${escapeMarkdownV2(req.body.phone)}\`\n\n ${req.body.notes ? `*Notes:* ${escapeMarkdownV2(req.body.notes)}\n` : ""}`;

      setImmediate(async () => {
        try {
          await Promise.all([
            notificationController.sendBoughtArt(
              newOrder,
              req.body,
              "Stripe",
              "Auction"
            ),
            notificationController.sendTelegramNotification(message, 0),
            notificationController.sendOrderEmails(
              newOrder,
              req.body,
              foundUser.email,
              "auction",
              "Stripe"
            ),
          ]);
          try {
            const oldProduct = await auction.findById(itemsPurchased._id);

            const newGalleryProduct = new galleryProduct({
              ...oldProduct.toObject(),
              _id: itemsPurchased._id,
            });
          
            await newGalleryProduct.save();
            await auction.deleteOne({ _id: itemsPurchased._id });
          } catch (err) {
            console.error(`Failed to move product ${itemsPurchased._id} to gallery:`, err);
          }
        } catch (error) {
          console.error("Error sending notifications:", error);
        }
      });

      return res.json({
        message: "Payment confirmed!",
        paymentIntent,
        orderId,
        redirectUrl: `${process.env.CLIENT_URL}/pending?orderId=${orderId}`,
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Payment confirmation failed", error });
    }
  }
}

module.exports = new PaymentController();
