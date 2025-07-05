const router = require("express").Router()
const OrderContoller = require("../controllers/order.controller")

router.get('/', OrderContoller.getOrders)

module.exports = router;