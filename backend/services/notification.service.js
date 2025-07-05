const axios = require("axios");

class NotificationService {
    async sendTelegram(message, chatId) {
        try {
            const response = await axios.post(process.env.TELEGRAM_API, {
                chat_id: chatId,
                text: message,
                parse_mode: "MarkdownV2",
              });
              if (response.status !== 200) throw new Error(response.statusText);
        }  catch (e) {
            console.error("Failed to send Telegram notification:", e);
            throw e;
        }
    }
}

module.exports = new NotificationService();