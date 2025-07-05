const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const mongoose = require("mongoose");
const auctionService = require("./services/auction.service");
const productRouter = require("./routes/product.routes");
const auctionRouter = require("./routes/auction.routes");
const paymentRouter = require("./routes/payment.routes");
const orderRouter = require("./routes/order.routes");
const searchRouter = require("./routes/search.routes");
const contactRouter = require("./routes/contact.routes");
const utilsRouter = require("./routes/utils.routes");
const galleryProductRouter = require("./routes/galleryProduct.routes");
const settingsRouter = require("./routes/settings.routes");
const userRouter = require("./routes/user.routes");
const bodyParser = require("body-parser");
const expressWs = require("express-ws")(app);
const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = yaml.load("./doc.yaml");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

new Promise((res, rej) => auctionService.activeAuctionsObserver());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/products", productRouter);
app.use("/api/auctions", auctionRouter);
app.use("/api/users", userRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/gallery-products", galleryProductRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/utils", utilsRouter);
app.use("/api/search", searchRouter);
app.use("/api/contact", contactRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("connected");
  } catch (e) {
    console.log("mongo error", e);
  }
  console.log(`${port}`);
});
