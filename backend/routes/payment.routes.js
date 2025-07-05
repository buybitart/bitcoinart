const router = require("express").Router();
const PaymentController = require("../controllers/payment.controller");

router.post("/create-invoice-btc", PaymentController.createInvoiceBTC);
router.post("/create-invoice-usdt", PaymentController.createInvoiceUSDT);
router.post("/create-invoice-btc-auction", PaymentController.createInvoiceBTCAuction);
router.post("/create-invoice-usdt-auction", PaymentController.createInvoiceUSDTAuction);
router.post("/webhook", PaymentController.webhookStatus);

router.post("/create-payment-intent", PaymentController.createPaymentIntent);
router.post("/confirm-payment", PaymentController.confirmPayment);
router.post("/confirm-payment-auction", PaymentController.confirmPaymentAuction);

router.get("/status/:orderId", PaymentController.checkStatus);

module.exports = router;
