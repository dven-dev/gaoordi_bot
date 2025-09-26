const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'О нас';
  const command = 'about';

  bot.command(command, async (ctx) => {
    await ctx.reply('Информация о ГАООРДИ и нашей миссии.');
  });

  bot.hears(keyboardText, async (ctx) => {
    await ctx.reply('Информация о ГАООРДИ и нашей миссии.');
  });
};

