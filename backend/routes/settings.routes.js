const router = require("express").Router()
const SettingsController = require("../controllers/settings.controller")


router.get("/:id", SettingsController.getSettings);
router.get("/", SettingsController.getMainSettings);
router.post("/", SettingsController.createSettings);
router.put("/", SettingsController.updateMainSettings);
router.put("/:id", SettingsController.updateSettings)

module.exports = router