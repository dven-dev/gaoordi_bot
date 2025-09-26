const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Ежемесячное пожертвование';
  const command = 'donate';

  bot.command(command, async (ctx) => {
    await ctx.reply('Здесь можно оформить ежемесячное пожертвование.');
  });

  bot.hears(keyboardText, async (ctx) => {
    await ctx.reply('Здесь можно оформить ежемесячное пожертвование.');
  });
};

