const { auction } = require("../models/auction");
const { galleryProduct } = require("../models/galleryProduct");
const { product } = require("../models/product");

class SearchController {
    async searchProducts(req, res) {
        try {
            const query = req.query.query;
            if (!query) {
              return res.status(400).json({ message: "Query parameter is required." });
            }
        
            const searchRegex = new RegExp(query, "i");
        
            const products = await product.find({
              $or: [{ title: searchRegex }, { hash: searchRegex }],
            });
        
            const auctions = await auction.find({
              $or: [{ title: searchRegex }, { hash: searchRegex }],
            });
        
            const galleryProducts = await galleryProduct.find({
              $or: [{ title: searchRegex }, { hash: searchRegex }],
            });
        
            return res.json({
              products: { title: "Shop", data: products },
              productsAuction: { title: "Auction", data: auctions },
              productsGallery: { title: "Gallery", data: galleryProducts },
            });
          } catch (error) {
            console.error("Search error:", error);
            res.status(500).json({ message: "Internal server error." });
          }
    }
}

module.exports = new SearchController();