const axios = require("axios");
const sharp = require("sharp");

class ProductService {
  async uploadImage(images) {
    if (!images) return null;

    if (typeof images === "string") {
      images = [images];
    }

    if (!Array.isArray(images)) {
      console.error("Invalid images input:", images);
      return null;
    }

    if (images.length === 0) return null;

    let files = [];

    for (let i = 0; i <= images.length - 1; i++) {
      const base64Image = images[i];

      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64Image)) {
        console.error("Invalid Base64 format", i);
        continue;
      }

      const imageBuffer = Buffer.from(base64Image, "base64");
      const resizedBuffer = await sharp(imageBuffer)
        .resize(770, 530)
        .toBuffer();
      const resizedBase64 = resizedBuffer.toString("base64");

      const uploadToImgbb = async (imageData) => {
        try {
          const response = await axios.post(
            `${process.env.API_IMG_URL}?key=${process.env.API_IMG_KEY}`,
            new URLSearchParams({ image: imageData }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          );

          if (response.data.success) {
            return {
              url: response.data.data.url,
              deleteUrl: response.data.data.delete_url,
            };
          } else return null;
        } catch (error) {
          console.error(
            "Image upload failed:",
            error.response?.data || error.message
          );
          return null;
        }
      };

      const original = await uploadToImgbb(base64Image);
      const optimized = await uploadToImgbb(resizedBase64);

      if (original && optimized) {
        files.push({
          original: original.url,
          optimized: optimized.url,
        });
      } else {
        console.error("Image upload failed:", { original, optimized });
      }
    }
    return files;
  }
}

module.exports = new ProductService();
