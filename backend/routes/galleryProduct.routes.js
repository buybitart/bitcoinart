const router = require("express").Router();
const GalleryProductContoller = require("../controllers/galleryProduct.controller");
const upload = require("../utils/multerConfig");

router.get("/", GalleryProductContoller.getProducts);
router.post("/", upload.single("video"), GalleryProductContoller.postProduct);
router.put(
  "/:id",
  upload.single("video"),
  GalleryProductContoller.updateProduct
);
router.get("/:id", GalleryProductContoller.getOneProduct);
router.delete("/:id", GalleryProductContoller.deleteProduct);

module.exports = router;
