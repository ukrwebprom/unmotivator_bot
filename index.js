/* require('dotenv').config(); */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const mongoose = require('mongoose');
const {UNMOTIVATOR_TOKEN, PORT, DB_UNM} = process.env;
const TeleBot = require('telebot');
let shutup = false;

const lastMessage = mongoose.model('Activity', { lastMessage: Date });

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

const checkTime = async (id) => {
  const lastMess = await lastMessage.findOne();
  const last = lastMess.lastMessage;
  const n = Date.now();
  const timeDiff = n - last.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  console.log('days:', days, 'hours:', hours, 'minutes', minutes);
  lastMess.lastMessage = n; 
  const ld = await lastMess.save();
  console.log(ld);
  if(days >= 2) {
    const d_word = days > 4 ? 'дней' : 'дня';
    bot.sendMessage(id, `О! это первое сообщение за последние ${days} ${d_word}`);
  }
}


  app.post('/webhook', async (req, res) => {
    
    const upd = req.body.message;
    const chat_id = upd?.chat?.id;
    const message = upd?.text;
    checkTime(chat_id);
    if(message.toLowerCase() == 'можно') shutup = false;
    if(message && !shutup) sendResponse(message.toLowerCase(), chat_id);
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
    skrip: ['скрип'],
    webinar: ['вебинар', 'вебінар'],
    hate: ['ненависть', 'ненавижу', 'ненавидеть'],
    react: ['реакт', 'react'],
    ai: [' ии ', 'нейросеть', 'gpt'],
    hard: ['тяжело', 'важко'],
    shut: ['зачини пельку'],
    youcan: ['можно']
  }
  const checker = (topic, msg) => {
      return library[topic].find(e => msg.includes(e));
  }
  async function sendResponse(msg, id) {
    if(checker('node', msg)) {
        await bot.sendMessage(id, 'Нода?? Класс!!');
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
    if(checker('webinar', msg)) {
      await bot.sendMessage(id, 'Я что-то пропустил?');
      return;
    }
    if(checker('hate', msg)) {
      await bot.sendMessage(id, 'да что ты знаешь о ненависти...');
      return;
    }
    if(checker('react', msg)) {
      await bot.sendMessage(id, 'реакт.. фигакт..');
      return;
    }
    if(checker('ai', msg)) {
      await bot.sendMessage(id, 'чертов ИИ нас всех оставит без работы. меня точно');
      return;
    }
    if(checker('hard', msg)) {
      await bot.sendMessage(id, 'а буде ще важче');
      return;
    }
    if(checker('shut', msg)) {
      shutup = true;
      await bot.sendMessage(id, 'мовчу.. мовчу.');
      return;
    }
    if(checker('youcan', msg)) {
      await bot.sendMessage(id, 'Дякую');
      return;
    }
  }

  start();