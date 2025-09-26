const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Контакты';
  const command = 'contacts';

  bot.command(command, async (ctx) => {
    await ctx.reply('Наши контакты: телефон, e-mail и адрес.');
  });

  bot.hears(keyboardText, async (ctx) => {
    await ctx.reply('Наши контакты: телефон, e-mail и адрес.');
  });
};
