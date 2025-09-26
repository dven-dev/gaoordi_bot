const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.hears('Ежемесячное пожертвование', async (ctx) => {
    await ctx.reply(
      `Вы можете сделать пожертвование по ссылке: https://example.com/donate`
    );
  });
};

