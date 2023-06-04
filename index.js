/* require('dotenv').config(); */
const express = require('express');
const bodyParser = require('body-parser');
const {UNMOTIVATOR_TOKEN, PORT} = process.env;
const TeleBot = require('telebot');
const bot = new TeleBot({
    token:UNMOTIVATOR_TOKEN,
    webhook: {
      url:'https://unmotivator-bot.onrender.com/webhook',
      host:'0.0.0.0',
      port:PORT
    }
  });

  const app = express();
  app.use(bodyParser.json());

  app.post('/webhook', (req, res) => {
    const upd = req.body.message;
    const chat_id = upd.chat.id;
    const message = upd.text;
    sendResponse(message.toLowerCase(), chat_id);
    res.status(200).json({ success: true });
  });
  
  app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
  });

  async function sendResponse(msg, id) {
    if(msg.includes('нода')) {
        await bot.sendMessage(id, 'Нода?? Ненавижу ноду');
        return;
    }
  }