const mongoose = require("mongoose");
const Joi = require("joi")
const Schema = mongoose.Schema;

const GalleryProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    video: {type: String},
    createdAt: { type: Date, default: Date.now },
    images: [
        {
            original: { type: String, required: true },
            optimized: { type: String, required: true },
        }
    ],
    hash: {type:String},
});

const galleryProduct = mongoose.model('GalleryProduct', GalleryProductSchema);
module.exports = {galleryProduct}
