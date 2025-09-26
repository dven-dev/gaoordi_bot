const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.hears('Адвент-календарь 🎄', async (ctx) => {
    await ctx.reply(
      `🎁 Добро пожаловать в Адвент-календарь добрых дел!`
    );
  });
};

