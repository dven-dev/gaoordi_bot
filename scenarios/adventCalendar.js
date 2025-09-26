const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Адвент-календарь';
  const command = 'advent';

  bot.command(command, async (ctx) => {
    await ctx.reply('Добро пожаловать в Адвент-календарь добрых дел!');
  });

  bot.hears(keyboardText, async (ctx) => {
    await ctx.reply('Добро пожаловать в Адвент-календарь добрых дел!');
  });
};

