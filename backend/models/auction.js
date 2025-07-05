const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AuctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    hash:{type: String},
    dimensions:{type: String},
    images: [
        {
          original: { type: String, required: true },
          optimized: { type: String, required: true },
        }
      ],
    video: {type: String },
    minPrice: {type: Schema.Types.Double},
    maxPrice: {type: Schema.Types.Double},
    delivery: {type: String},
    endTime: {type: String},
    currentPrice: { type: Number, default: 0 },
    bids: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
    ],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', "waitingForPay","waitingForConfirmation", 'completed', 'failed'], default: 'active' },
    blackList: [],
    createdAt: { type: Date, default: Date.now },
});
const auction = mongoose.model('Auction', AuctionSchema);
module.exports = {auction}
