const router = require("express").Router();
const UtilsController = require("../controllers/utils.controller");
const multer = require("multer");
const upload = require("../utils/multerConfig");

const uploadAny = multer({
  limits: {
    fieldSize: 50 * 1024 * 1024,
  },
});

router.put("/change-type/:id", upload.single("video"), UtilsController.changeType);
router.post("/upload-images", uploadAny.any(), UtilsController.uploadImages);

module.exports = router;