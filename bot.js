require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const mongoose = require('mongoose');

const Subscriber = require('./models/Subscriber');
const Scenario = require('./models/Scenario');
const UserProgress = require('./models/UserProgress');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Подключение MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- /start ---
bot.start(async (ctx) => {
  const { id: userId, username, first_name } = ctx.from;
  const chatId = ctx.chat.id;

  // Сохраняем подписчика
  await Subscriber.findOneAndUpdate(
    { chatId },
    { userId, chatId, username },
    { upsert: true }
  );

  // Создаём или обновляем прогресс пользователя
  await UserProgress.findOneAndUpdate(
    { userId, chatId },
    { userId, chatId },
    { upsert: true }
  );

  // Приветственное сообщение с меню
  await ctx.reply(
    `👋 Привет, ${first_name}! Добро пожаловать в наш бот!`,
    Markup.keyboard([
      ['Адвент-календарь', 'Истории'],
      ['Наши проекты', 'Ежемесячное пожертвование'],
      ['О нас', 'Контакты']
    ]).resize()
  );
});

// --- Обработка выбора меню ---
bot.hears(['Адвент-календарь', 'Истории', 'Наши проекты', 'Ежемесячное пожертвование', 'О нас', 'Контакты'], async (ctx) => {
  const userId = ctx.from.id;
  const chatId = ctx.chat.id;
  const menuName = ctx.message.text;

  // Находим сценарий по имени пункта меню
  const scenario = await Scenario.findOne({ name: menuName });
  if (!scenario) return ctx.reply('Диалог для этого пункта пока недоступен.');

  // Создаём или обновляем прогресс пользователя
  await UserProgress.findOneAndUpdate(
    { userId, chatId },
    { currentScenario: scenario._id, currentStep: 0 },
    { upsert: true }
  );

  // Отправляем первый шаг сценария
  ctx.reply(`🗺 Вы начали: ${scenario.name}`);
  if (scenario.steps.length > 0) {
    ctx.reply(`Шаг 1: ${scenario.steps[0]}`);
  }
});

// --- Обработка текста пользователя ---
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const chatId = ctx.chat.id;

  // Игнорируем нажатия на кнопки меню (они обрабатываются выше)
  const menuItems = ['Адвент-календарь', 'Истории', 'Наши проекты', 'Ежемесячное пожертвование', 'О нас', 'Контакты'];
  if (menuItems.includes(ctx.message.text)) return;

  const progress = await UserProgress.findOne({ userId, chatId }).populate('currentScenario');
  if (!progress || !progress.currentScenario) return;

  const stepIndex = progress.currentStep;
  const steps = progress.currentScenario.steps;

  ctx.reply(`Вы ответили: ${ctx.message.text}`);

  const nextStep = stepIndex + 1;
  if (nextStep < steps.length) {
    await UserProgress.findOneAndUpdate(
      { userId, chatId },
      { currentStep: nextStep }
    );
    ctx.reply(`Шаг ${nextStep + 1}: ${steps[nextStep]}`);
  } else {
    await UserProgress.findOneAndUpdate(
      { userId, chatId },
      { currentScenario: null, currentStep: 0 }
    );
    ctx.reply('🎉 Диалог завершён! Вы можете выбрать другой пункт меню.');
  }
});

module.exports = bot;

// --- Настройка webhook для публичного домена ---
if (process.env.NODE_ENV === 'production') {
  bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot`)
    .then(() => console.log(`🤖 Webhook установлен: ${process.env.WEBHOOK_URL}/bot`))
    .catch(console.error);
}
