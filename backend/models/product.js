const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Schema.Types.Double, required: true },
  video: { type: String },
  images: [
  {
    original: { type: String, required: true },
    optimized: { type: String, required: true },
  }
],
  createdAt: { type: Date, default: Date.now },
  dimensions: { type: String },
  delivery: { type: String },
  hash: { type: String },
});

const productValidate = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    price: Joi.number().required(),
    video: Joi.string().allow(""),
    images: Joi.array().items(
        Joi.object({
            original: Joi.string().uri().required(),
            optimized: Joi.string().uri().required(),
            deleteOriginal: Joi.string().uri().required(),
            deleteOptimized: Joi.string().uri().required(),
        })
    ),
    createdAt: Joi.date().default(Date.now),
    dimensions: Joi.string().allow(""),
    delivery: Joi.string().allow(""),
    hash: Joi.string().allow("")
});

const product = mongoose.model("Product", ProductSchema);
module.exports = { product, productValidate };