require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const mongoose = require('mongoose');

// Импорт моделей
const Subscriber = require('./models/Subscriber');
const Scenario = require('./models/Scenario');
const UserProgress = require('./models/UserProgress');

// Создание экземпляра бота с токеном из .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// -------------------- Подключение к MongoDB --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// -------------------- /start --------------------
bot.start(async (ctx) => {
  const { id: userId, username } = ctx.from;
  const chatId = ctx.chat.id;

  // Сохраняем подписчика или обновляем username
  await Subscriber.findOneAndUpdate(
    { chatId },           // ищем по chatId
    { userId, chatId, username }, // обновляем данные
    { upsert: true }      // если нет, создаем
  );

  // Создаём или обновляем прогресс пользователя в этом чате
  await UserProgress.findOneAndUpdate(
    { userId, chatId },   // ключ поиска — userId + chatId
    { userId, chatId },   // минимальный объект для upsert
    { upsert: true }
  );

  // Получаем все сценарии
  const scenarios = await Scenario.find();
  if (scenarios.length === 0) return ctx.reply('Сценариев пока нет.');

  // Создаём кнопки для выбора сценария
  const buttons = scenarios.map(s => [Markup.button.callback(s.name, `scenario_${s._id}`)]);
  ctx.reply('👋 Выберите сценарий:', Markup.inlineKeyboard(buttons));
});

// -------------------- Выбор сценария --------------------
bot.action(/scenario_(.+)/, async (ctx) => {
  const scenarioId = ctx.match[1];
  const scenario = await Scenario.findById(scenarioId);
  if (!scenario) return ctx.reply('Сценарий не найден.');

  const userId = ctx.from.id;
  const chatId = ctx.chat.id;

  // Обновляем прогресс: текущий сценарий и шаг
  await UserProgress.findOneAndUpdate(
    { userId, chatId },
    { currentScenario: scenario._id, currentStep: 0 },
    { upsert: true }
  );

  ctx.reply(`🗺 Вы начали сценарий: ${scenario.name}`);
  ctx.reply(`Шаг 1: ${scenario.steps[0]}`);
});

// -------------------- Обработка текста пользователя --------------------
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const chatId = ctx.chat.id;

  // Получаем прогресс пользователя с популяцией текущего сценария
  const progress = await UserProgress.findOne({ userId, chatId }).populate('currentScenario');
  if (!progress || !progress.currentScenario) return;

  const stepIndex = progress.currentStep;
  const steps = progress.currentScenario.steps;

  // Отправляем ответ пользователя
  ctx.reply(`Вы ответили: ${ctx.message.text}`);

  const nextStep = stepIndex + 1;
  if (nextStep < steps.length) {
    // Обновляем шаг прогресса
    await UserProgress.findOneAndUpdate(
      { userId, chatId },
      { currentStep: nextStep }
    );
    ctx.reply(`Шаг ${nextStep + 1}: ${steps[nextStep]}`);
  } else {
    // Завершаем сценарий
    await UserProgress.findOneAndUpdate(
      { userId, chatId },
      { currentScenario: null, currentStep: 0 }
    );
    ctx.reply('🎉 Сценарий завершён!');
  }
});

// -------------------- Экспорт бота --------------------
module.exports = bot;

// -------------------- Настройка webhook для публичного домена --------------------
if (process.env.NODE_ENV === 'production') {
  bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot`)
    .then(() => console.log(`🤖 Webhook установлен: ${process.env.WEBHOOK_URL}/bot`))
    .catch(console.error);
}
