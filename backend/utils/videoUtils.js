const path = require("path");
const fs = require("fs");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegStatic);

const compressedDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec("libx264")
      .size("80%")
      .on("end", () => {
        console.log("✅ Video compression completed!");
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("❌ Video compression failed:", err);
        reject(err);
      })
      .run();
  });
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("❌ Error deleting file:", err);
    else console.log("✅ File deleted successfully:", filePath);
  });
};

module.exports = { compressVideo, deleteFile };