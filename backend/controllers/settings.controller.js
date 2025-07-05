const settingsService = require("../services/settings.service");

class SettingsController {
  async getSettings(req, res) {
    try {
      const page = await settingsService.getSettings(req.params.id);
      if (!page) return res.status(404).send("not found");
      // console.log(page)
      res.status(200).json(page);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getMainSettings(req, res) {
    try {
      const settings = await settingsService.getMainSettings();
      if (!settings || !Object.keys(settings[0]).length) return res.status(404).send("not found");
      res.status(200).json(settings[0]);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async createSettings(req, res) {
    try {
      const result = await settingsService.createSettings(req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async updateMainSettings(req, res) {
    try {
      const result = await settingsService.updateSettings(req.body);
      res.status(200).json(result);
    } catch (e) {
      console.log("Error updating settings:", e);
      res.status(500).json(e);
    }
  }

  async updateSettings(req, res) {
    try {
      const result = await settingsService.updateMainSettings(req.params.id, req.body);
      res.status(200).json(result);
    } catch (e) {
      console.log("Error updating settings:", e);
      res.status(500).json(e);
    }
  }
}

module.exports = new SettingsController();
