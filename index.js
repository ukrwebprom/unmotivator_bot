/* require('dotenv').config(); */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const mongoose = require('mongoose');
const {UNMOTIVATOR_TOKEN, PORT, DB_UNM} = process.env;
const TeleBot = require('telebot');
/* let lastMessage; */
const lastMessage = mongoose.model('Activity', { lastMessage: Date });
const doc = new lastMessage();
const bot = new TeleBot({
    token:UNMOTIVATOR_TOKEN,
    webhook: {
      url:'https://unmotivator-bot.onrender.com/webhook',
      host:'0.0.0.0',
      port:PORT
    }
  });

  bot.setWebhook('https://unmotivator-bot.onrender.com/webhook').then(w => console.log(w));
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.post('/webhook', async (req, res) => {
/*     if(!lastMessage) lastMessage = Date.now(); */
    /* doc.lastMessage = Date.now(); */
    /* const ld = await lastMessage.create({lastMessage: Date.now()}); */
    const oldLastDate = await lastMessage.findOne();
    console.log(oldLastDate);
    oldLastDate.lastMessage = Date.now(); 
    const ld = await oldLastDate.save();
    console.log(ld);
    const upd = req.body.message;
    const chat_id = upd?.chat?.id;
    const message = upd?.text;
    if(message) sendResponse(message.toLowerCase(), chat_id);
    res.status(200).json({ success: true });
  });
  
  const start = async () => {
    try {
      await mongoose.connect(DB_UNM);
      console.log("MongoDB connected");
      app.listen(PORT, () => {
        console.log(`Webhook server is running on port ${PORT}`);
      });
    } catch {
      console.log("MongoDB connection error");
    }
  }

  const library = {
    node: ['нода', 'node', 'node js', 'ноду', 'ноде'],
    sobes: ['собес', 'співбес'],
    privet: ['привет', 'привіт', 'салют'],
    native: ['native', 'нейтив', 'нейтів'],
    skrip: ['скрип']
  }
  const checker = (topic, msg) => {
      return library[topic].find(e => msg.includes(e));
  }
  async function sendResponse(msg, id) {
    if(checker('node', msg)) {
        await bot.sendMessage(id, 'Нода?? Ненавижу ноду');
        return;
    }
    if(checker('sobes', msg)) {
      await bot.sendMessage(id, 'Собес нам только снится. не ну реально..');
      return;
    }
    if(checker('privet', msg)) {
      await bot.sendMessage(id, 'Привіт');
      return;
    }
    if(checker('native', msg)) {
      await bot.sendMessage(id, 'Взагалі то не розумію навищо нам той нейтів');
      return;
    }
    if(checker('skrip', msg)) {
      await bot.sendMessage(id, 'скрип реально действует на нервы');
      return;
    }
  }

  start();