const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isActivated: { type: Boolean, default:false },
    activationLink: { type:String },
    password: { type: String },
    name: { type: String, required: false },
    walletAddress: { type: String },
    isAdmin: { type: Boolean, default: false },
    refreshToken: { type: String }, 
    bids:[{type: mongoose.Schema.Types.ObjectId, ref:"Bid"}],
    orders:[{type: mongoose.Schema.Types.ObjectId, ref:"Order"}]
  });
  
const user = mongoose.model('User', UserSchema);
module.exports = {user}