const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.hears('Истории', async (ctx) => {
    await ctx.reply(
      `Истории подопечных...`
    );
  });
};
