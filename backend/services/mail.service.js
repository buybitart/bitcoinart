const nodemailer = require("nodemailer");
class MailService {
  transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(from, receivers, subject, text, html) {
    try {
      let info = await this.transporter.sendMail({
        from,
        to: receivers,
        subject,
        text,
        html,
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

module.exports = new MailService();
