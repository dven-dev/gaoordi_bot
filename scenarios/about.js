const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.hears('О нас', async (ctx) => {
    await ctx.reply(
      `ГАООРДИ - это...`
    );
  });
};
