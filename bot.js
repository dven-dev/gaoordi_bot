require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

const Subscriber = require('./models/Subscriber');
const UserProgress = require('./models/UserProgress');

// импорт сценариев
const adventCalendar = require('./scenarios/adventCalendar');
const stories = require('./scenarios/stories');
const ourProjects = require('./scenarios/ourProjects');
const monthlyDonation = require('./scenarios/monthlyDonation');
const about = require('./scenarios/about');
const contacts = require('./scenarios/contacts');

const bot = new Telegraf(process.env.BOT_TOKEN);

// подключение MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// --- /start ---
bot.start(async (ctx) => {
  const { id: userId, username } = ctx.from;
  const chatId = ctx.chat.id;

  // сохраняем подписчика
  await Subscriber.findOneAndUpdate(
    { chatId },
    { userId, username },
    { upsert: true, new: true }
  );

  // создаём прогресс
  await UserProgress.findOneAndUpdate(
    { userId, chatId },
    { userId, chatId },
    { upsert: true }
  );

  // приветственное сообщение
  await ctx.reply('Добро пожаловать в бота ГАООРДИ!');

  // сразу устанавливаем встроенное меню слева
  await bot.telegram.setMyCommands([
    { command: 'advent', description: 'Адвент-календарь' },
    { command: 'stories', description: 'Истории' },
    { command: 'projects', description: 'Наши проекты' },
    { command: 'donate', description: 'Ежемесячное пожертвование' },
    { command: 'about', description: 'О нас' },
    { command: 'contacts', description: 'Контакты' }
  ]);

  // нижняя клавиатура
  await ctx.reply('Выберите пункт меню ниже:', {
    reply_markup: {
      keyboard: [
        ['Адвент-календарь'],
        ['Истории'],
        ['Наши проекты'],
        ['Ежемесячное пожертвование'],
        ['О нас'],
        ['Контакты']
      ],
      resize_keyboard: true
    }
  });
});

// подключаем сценарии
adventCalendar(bot);
stories(bot);
ourProjects(bot);
monthlyDonation(bot);
about(bot);
contacts(bot);

module.exports = bot;

// --- запуск (локально long polling, на сервере webhook) ---
if (process.env.NODE_ENV === 'production') {
  bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot`)
    .then(() => console.log(`Webhook установлен: ${process.env.WEBHOOK_URL}/bot`))
    .catch(console.error);
} else {
  bot.launch().then(() => console.log('Bot запущен в режиме polling'));
}
