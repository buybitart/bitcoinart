const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    list: [{ type: String, default: undefined }],
    additional: { type: String, default: undefined },
    images: [
      {
        original: { type: String, required: true },
        optimized: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sections: [SectionSchema],
});

const NotificationCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    checked: { type: Boolean, required: true },
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    contactEmail: { type: String },
    telegramChatId: { type: String },
    emailNotifications: {
      all: { type: Boolean, required: true, default: true },
      categories: [NotificationCategorySchema],
    },
    telegramNotifications: {
      all: { type: Boolean, required: true, default: true },
      categories: [NotificationCategorySchema],
    },
  },
  {
    capped: {
      max: 1,
    },
  }
);

const Page = mongoose.model("Page", PageSchema);
const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = { Page, Settings };
