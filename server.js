require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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
  try {
    const subs = await Subscriber.find();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Примитивная аналитика ---
app.get('/admin/stats', async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.json({ totalSubscribers: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Сценарии ---
app.get('/admin/scenarios', async (req, res) => {
  try {
    const scenarios = await Scenario.find();
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/scenarios', async (req, res) => {
  try {
    const scenario = new Scenario(req.body);
    await scenario.save();
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Редирект с главной страницы на /admin ---
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// --- Настройка порта и хоста ---
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// --- Подключение MongoDB и запуск сервера с ботом ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Запускаем Telegram-бота
    if (!process.env.BOT_TOKEN) {
      console.error('❌ BOT_TOKEN is missing!');
      process.exit(1);
    }

    bot.launch()
      .then(() => console.log('🤖 Bot started'))
      .catch(err => console.error('❌ Bot launch error:', err));

    // Запуск Express
    app.listen(PORT, HOST, () => {
      console.log(`🌍 Admin panel running at http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
