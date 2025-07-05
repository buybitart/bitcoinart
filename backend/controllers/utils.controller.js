const productService = require("../services/product.service");
const { product } = require("../models/product");
const { galleryProduct } = require("../models/galleryProduct");
const { auction } = require("../models/auction");

const path = require("path");
const { compressVideo, deleteFile } = require("../utils/videoUtils");

const fs = require('fs')
const compressedDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

class UtilsController {
  async changeType(req, res) {
    try {
      const updatedData = req.body;
      const { id } = req.params;

      if (updatedData.images && typeof updatedData.images === "string")
        updatedData.images = JSON.parse(updatedData.images);

      const models = {
        usual: product,
        gallery: galleryProduct,
        auction: auction,
      };

      const oldProduct = await models[updatedData.itemType].findById(id);
      if (!oldProduct)
        return res.status(404).json({ message: "Товар не найден" });

      if (req.file) {
        console.log("Uploaded new video:", req.file.path);

        if (oldProduct.video) {
          const oldVideoPath = path.join(compressedDir, oldProduct.video);
          deleteFile(oldVideoPath)
        }

        const compressedPath = path.join(compressedDir, req.file.filename);
        await compressVideo(req.file.path, compressedPath);
        deleteFile(req.file.path)

        updatedData.video = req.file.filename;
      } else updatedData.video = oldProduct.video;

      await models[updatedData.itemType].deleteOne({ _id: id });

      const newModel = models[updatedData.newType];
      if (!newModel) return res.status(400).json({ message: "Invalid newType provided" });
      const newProduct = await newModel.create({ ...updatedData, _id: id });

      res.status(200).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка при смене типа товара" });
    }
  }

  async uploadImages(req, res) {
    try {
      const uploadedImages = await productService.uploadImage(req.body.images);
      res.json(uploadedImages);
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка загрузки изображений");
    }
  }
}

module.exports = new UtilsController();
