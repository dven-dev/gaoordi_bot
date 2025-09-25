const express = require('express');
const mongoose = require('mongoose');
const bot = require('./bot');

require('dotenv').config();

const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI);

// Модель подписчиков
const Subscriber = mongoose.model('Subscriber');

// 📋 Список подписчиков
app.get('/admin/subscribers', async (req, res) => {
  const subs = await Subscriber.find();
  res.json(subs);
});

// 📊 Примитивная аналитика
app.get('/admin/stats', async (req, res) => {
  const count = await Subscriber.countDocuments();
  res.json({ totalSubscribers: count });
});

// 🗺️ Редактор сценариев (храним в базе)
const Scenario = mongoose.model('Scenario', new mongoose.Schema({
  name: String,
  steps: Array
}));

app.get('/admin/scenarios', async (req, res) => {
  res.json(await Scenario.find());
});

app.post('/admin/scenarios', async (req, res) => {
  const scenario = new Scenario(req.body);
  await scenario.save();
  res.json(scenario);
});

// Запуск бота и сервера
bot.launch();
app.listen(3000, () => console.log('Админка: http://localhost:3000'));

