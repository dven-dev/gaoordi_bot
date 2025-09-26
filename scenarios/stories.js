const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Истории';
  const command = 'stories';

  bot.command(command, async (ctx) => {
    await ctx.reply('Здесь будут наши истории.');
  });

  bot.hears(keyboardText, async (ctx) => {
    await ctx.reply('Здесь будут наши истории.');
  });
};


