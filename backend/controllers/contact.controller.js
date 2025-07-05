const notificationController = require("./notification.controller");

class ContactController {
  async sendContactMail(req, res) {
    try {
      const { name, email, message } = req.body;
      await notificationController.sendContactForm(name, email, message);
      
      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = new ContactController();
