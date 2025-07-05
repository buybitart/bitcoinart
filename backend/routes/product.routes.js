const router = require("express").Router();
const ProductController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../utils/multerConfig");

router.get("/", ProductController.getProducts);
router.get("/first-two", ProductController.getFirstTwo);
router.post(
  "/",
  authMiddleware,
  upload.single("video"),
  ProductController.postProduct
);
router.put("/:id", upload.single("video"), ProductController.updateProduct);
router.get("/:id", ProductController.getOneProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
