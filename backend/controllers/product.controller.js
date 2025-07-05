const { product } = require("../models/product");
const productService = require("../services/product.service");
const path = require("path");
const { compressVideo, deleteFile } = require("../utils/videoUtils");

const fs = require('fs')
const compressedDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await product.find({}).sort({ createdAt: -1 });
      res.send(products);
    } catch (e) {
      res.status(400).send("error caused");
    }
  }

  async getFirstTwo(req, res) {
    try {
      const products = await product
        .find({}, "title hash images price dimensions delivery")
        .sort({ createdAt: -1 })
        .limit(2);
  
      res.send(products);
    } catch (e) {
      res.status(400).send("error caused");
    }
  }

  async getOneProduct(req, res) {
    try {
      const foundProduct = await product.findOne({ hash: req.params.id });
      return res.status(200).json(foundProduct);
    } catch (e) {
      return res.status(500).send("not found");
    }
  }

  async postProduct(req, res) {
    try {
      const imgUrls = await productService.uploadImage(req.body.images);

      delete req.body.images;
      if (imgUrls) req.body.images = imgUrls;

      let videoFilename = null;

      if (req.file) {
        console.log("Uploaded video:", req.file.path);

        const compressedPath = path.join(compressedDir, req.file.filename);
        await compressVideo(req.file.path, compressedPath);

        console.log("Video compressed:", req.file.filename);

        deleteFile(req.file.path)

        videoFilename = req.file.filename;
      }

      req.body.video = videoFilename;

      const products = await product.insertMany(req.body);
      res.status(201).json(products);
    } catch (e) {
      console.log(e);
      res.status(500).send("error caused");
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      if (updatedData.images && typeof updatedData.images === 'string') updatedData.images = JSON.parse(updatedData.images);

      const existingProduct = await product.findById(id);
      if (!existingProduct) return res.status(404).json({ message: "Product not found" });

      if (req.file) {
        console.log("Uploaded new video:", req.file.path);

        if (existingProduct.video) {
          const oldVideoPath = path.join(compressedDir, existingProduct.video);
          deleteFile(oldVideoPath)
        }

        const compressedPath = path.join(compressedDir, req.file.filename);
        await compressVideo(req.file.path, compressedPath);
        deleteFile(req.file.path)

        updatedData.video = req.file.filename;
      } else updatedData.video = existingProduct.video;

      const updatedProduct = await product.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      res.status(200).json(updatedProduct);
    } catch (e) {
      console.error(e);
      res.status(500).send("error caused");
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const productToDelete = await product.findById(id);

      if (!productToDelete)
        return res.status(404).json({ message: "Product not found" });

      if (productToDelete.video) {
        const videoPath = path.join(compressedDir, productToDelete.video);
        deleteFile(videoPath)
      }

      await product.deleteOne({ _id: id });
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (e) {
      console.log(e);
      res.status(500).send("Error occurred while deleting product");
    }
  }
}

module.exports = new ProductController();
