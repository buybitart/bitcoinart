const express = require("express");
const expressWs = require("express-ws");

expressWs(express());
const router = express.Router();
const AuctionController = require("../controllers/auction.controller");
const upload = require("../utils/multerConfig");

router.get("/", AuctionController.getAuctions);
router.post("/", upload.single("video"), AuctionController.postAuction);
router.get("/:id", AuctionController.getOneAuction);
router.put("/:id", upload.single("video"), AuctionController.updateAuction);
router.post("/place-bet/:id", AuctionController.placeBet);
router.get("/:hash/bids", AuctionController.getBids);
router.delete("/:id", AuctionController.deleteAuction);

router.ws("/:id", AuctionController.handleWs);
module.exports = router;
