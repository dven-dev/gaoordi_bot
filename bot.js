const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Схема подписчиков
const Subscriber = mongoose.model('Subscriber', new mongoose.Schema({
  userId: Number,
  username: String,
  joinedAt: { type: Date, default: Date.now }
}));

// При старте
bot.start(async (ctx) => {
  const { id, username } = ctx.from;
  await Subscriber.findOneAndUpdate(
    { userId: id },
    { username },
    { upsert: true }
  );
  ctx.reply('👋 Привет! Вы подписаны на бота.');
});

// Пример команды
bot.command('help', (ctx) => {
  ctx.reply('Список команд: /help, /stats');
});

module.exports = bot;

