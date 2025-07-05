const { bid } = require("../models/bid")

class BidsService{
    async createBid(bidData) {
        try {
          const newBid = await bid.create(bidData);
          return await newBid.populate("user");
        } catch (error) {
          console.error("Error creating bid:", error);
          throw error;
        }
      }

    async getBids(){
        return await bid.find().populate("auction")
    }
}

module.exports = new BidsService