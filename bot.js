require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const mongoose = require('mongoose');

// Подключение моделей
const Subscriber = require('./models/Subscriber');
const Scenario = require('./models/Scenario');
const UserProgress = require('./models/UserProgress');

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- /start — подписка и выбор сценария ---
bot.start(async (ctx) => {
  const { id, username } = ctx.from;

  // Сохраняем пользователя
  await Subscriber.findOneAndUpdate(
    { userId: id },
    { username },
    { upsert: true }
  );

  const scenarios = await Scenario.find();
  if (scenarios.length === 0) {
    return ctx.reply('Сценариев пока нет.');
  }

  // Кнопки выбора сценария
  const buttons = scenarios.map(s => [Markup.button.callback(s.name, `scenario_${s._id}`)]);
  ctx.reply('👋 Привет! Выберите сценарий:', Markup.inlineKeyboard(buttons));
});

// --- Выбор сценария ---
bot.action(/scenario_(.+)/, async (ctx) => {
  const scenarioId = ctx.match[1];
  const scenario = await Scenario.findById(scenarioId);
  if (!scenario) return ctx.reply('Сценарий не найден.');

  // Сохраняем прогресс пользователя
  await UserProgress.findOneAndUpdate(
    { userId: ctx.from.id },
    { currentScenario: scenario._id, currentStep: 0 },
    { upsert: true }
  );

  ctx.reply(`🗺 Вы начали сценарий: ${scenario.name}`);
  ctx.reply(`Шаг 1: ${scenario.steps[0]}`);
});

// --- Обработка текста пользователя и переход к следующему шагу ---
bot.on('text', async (ctx) => {
  const progress = await UserProgress.findOne({ userId: ctx.from.id }).populate('currentScenario');
  if (!progress || !progress.currentScenario) return;

  const stepIndex = progress.currentStep;
  const steps = progress.currentScenario.steps;

  ctx.reply(`Вы ответили: ${ctx.message.text}`);

  const nextStep = stepIndex + 1;
  if (nextStep < steps.length) {
    await UserProgress.findOneAndUpdate(
      { userId: ctx.from.id },
      { currentStep: nextStep }
    );
    ctx.reply(`Шаг ${nextStep + 1}: ${steps[nextStep]}`);
  } else {
    // Сценарий завершён
    await UserProgress.findOneAndUpdate(
      { userId: ctx.from.id },
      { currentScenario: null, currentStep: 0 }
    );
    ctx.reply('🎉 Сценарий завершён!');
  }
});

// --- Запуск бота ---
bot.launch().then(() => console.log('🤖 Bot started'));

// Обработка graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
