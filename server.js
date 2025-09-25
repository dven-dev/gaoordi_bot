require('dotenv').config();
const express = require('express');
const bot = require('./bot');
const Subscriber = require('./models/Subscriber');
const Scenario = require('./models/Scenario');

const app = express();
app.use(express.json());

// Список подписчиков
app.get('/admin/subscribers', async (req, res) => {
  const subs = await Subscriber.find();
  res.json(subs);
});

// Примитивная аналитика
app.get('/admin/stats', async (req, res) => {
  const count = await Subscriber.countDocuments();
  res.json({ totalSubscribers: count });
});

// Сценарии
app.get('/admin/scenarios', async (req, res) => {
  res.json(await Scenario.find());
});

app.post('/admin/scenarios', async (req, res) => {
  const scenario = new Scenario(req.body);
  await scenario.save();
  res.json(scenario);
});

// Запуск бота и сервера
bot.launch().then(() => console.log('🤖 Bot started'));
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`🌍 Admin panel: http://<SERVER_IP>:${process.env.PORT}`);
});
