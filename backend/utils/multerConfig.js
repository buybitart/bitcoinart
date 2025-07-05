const multer = require("multer");
const fs = require("fs");
const path = require("path");

const originalDir = path.join(__dirname, "..", "uploads", "original");
const compressedDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, originalDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/hevc",
    "application/octet-stream"
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.endsWith(".mov")) {
    cb(null, true);
  } else {
    cb(new Error(`Only video formats allowed! Detected type: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024 * 1024,
    fields: 50,
    fieldNameSize: 500,
    fieldSize: 50 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;