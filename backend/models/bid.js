const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BidSchema = new mongoose.Schema({
	amount: {type: Number, required: true},
    user: {type:Schema.Types.ObjectId, ref:"User", required:true},
    auction: {type: Schema.Types.ObjectId, ref:"Auction", required:true},
    date: {type:Date, default:Date.now}
});

const bid = mongoose.model('Bid', BidSchema);
module.exports = { bid }