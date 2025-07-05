const { Settings, Page } = require("../models/settings");

class SettingsService {
  async createSettings(settingsData) {
    return await Settings.create(settingsData);
  }

  async getSettings(name) {
    const result = await Page.findOne({ name }, { _id: 0, __v: 0 }).lean();
    if (result && result.sections) {
      result.sections.forEach((section) => {
        if (section.images) section.images.forEach((image) => delete image._id);
        delete section._id;
      });
    }
    return result;
  }

  async getMainSettings() {
    return await Settings.find({});
  }

  async updateSettings(data) {
    return await Settings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
  }

  async updateMainSettings(name, data) {
    return await Page.findOneAndUpdate({ name }, data, {
      new: true,
      upsert: true,
    });
  }

  async addSiteTexts(texts) {
    let entity = await Settings.find()[0];
    for (let text in texts) {
      entity["siteTexts"][text] = texts[text];
    }
    return await Settings.updateOne(entity);
  }
}

module.exports = new SettingsService();
