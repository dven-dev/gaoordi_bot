require('dotenv').config();
const express = require('express');
const bot = require('./bot');
const Subscriber = require('./models/Subscriber');
const Scenario = require('./models/Scenario');

const app = express();
app.use(express.json());

// --- Главная страница админки ---
app.get('/admin', (req, res) => {
  res.send(`
    <h1>Админ-панель бота</h1>
    <ul>
      <li><a href="/admin/subscribers">📋 Подписчики</a></li>
      <li><a href="/admin/stats">📊 Статистика</a></li>
      <li><a href="/admin/scenarios">📝 Сценарии</a></li>
    </ul>
  `);
});

// --- Подписчики ---
app.get('/admin/subscribers', async (req, res) => {
  const subs = await Subscriber.find();
  res.json(subs);
});

// --- Примитивная аналитика ---
app.get('/admin/stats', async (req, res) => {
  const count = await Subscriber.countDocuments();
  res.json({ totalSubscribers: count });
});

// --- Сценарии ---
app.get('/admin/scenarios', async (req, res) => {
  res.json(await Scenario.find());
});

app.post('/admin/scenarios', async (req, res) => {
  const scenario = new Scenario(req.body);
  await scenario.save();
  res.json(scenario);
});

// --- Запуск бота ---
bot.launch().then(() => console.log('🤖 Bot started'));

// --- Сервер ---
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🌍 Admin panel: http://${HOST}:${PORT}`);
});

// --- Редирект с главной страницы на /admin ---
app.get('/', (req, res) => {
  res.redirect('/admin');
});
