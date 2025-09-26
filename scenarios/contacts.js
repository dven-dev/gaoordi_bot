const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.hears('Контакты', async (ctx) => {
    await ctx.reply(
      `📞 Контакты ГАООРДИ:\n\nEmail: info@gaoordi.ru\nТелефон: +7 (812) 123-45-67`
    );
  });
};
