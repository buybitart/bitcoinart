const { galleryProduct } = require("../models/galleryProduct");
const productService = require("../services/product.service");
const path = require("path");
const { compressVideo, deleteFile } = require("../utils/videoUtils");

const fs = require('fs')
const compressedDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

class GalleryProductContoller {
  async getProducts(req, res) {
    try {
      const products = await galleryProduct.find({}).sort({ createdAt: -1 });
      res.send(products);
    } catch (e) {
      res.status(400).send("error caused");
    }
  }

  async getOneProduct(req, res) {
    try {
      const foundProduct = await galleryProduct.findOne({
        hash: req.params.id,
      });
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

        deleteFile(req.file.path);

        videoFilename = req.file.filename;
      }

      req.body.video = videoFilename;

      const products = await galleryProduct.insertMany(req.body);
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

      const existingGProduct = await galleryProduct.findById(id);
      if (!existingGProduct)
        return res.status(404).json({ message: "Product not found" });

      if (req.file) {
        console.log("Uploaded new video:", req.file.path);

        if (existingGProduct.video) {
          const oldVideoPath = path.join(compressedDir, existingGProduct.video);
          deleteFile(oldVideoPath)
        }

        const compressedPath = path.join(compressedDir, req.file.filename);
        await compressVideo(req.file.path, compressedPath);
        deleteFile(req.file.path)

        updatedData.video = req.file.filename;
      } else updatedData.video = existingGProduct.video;

      const updatedProduct = await galleryProduct.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true,
        }
      );

      res.status(200).json(updatedProduct);
    } catch (e) {
      console.error(e);
      res.status(500).send("error caused");
    }
  }

  async deleteProduct(req, res) {
    try {
      const productToDelete = await galleryProduct.findById(req.params.id);

      if (!productToDelete)
        return res.status(404).json({ message: "Gallery product not found" });

      if (productToDelete.video) {
        const videoPath = path.join(compressedDir, productToDelete.video);
        deleteFile(videoPath)
      }

      await galleryProduct.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Gallery product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error occurred while deleting gallery product");
    }
  }
}

module.exports = new GalleryProductContoller();
