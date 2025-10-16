const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Ежемесячное пожертвование';
  const command = 'donate';

  // Универсальная функция — чтобы не дублировать код
  const sendDonateMessage = async (ctx) => {
    const message = `
💖 *Ежемесячное пожертвование*

Ежемесячное пожертвование — это автоматическое пожертвование, которое списывается в один и тот же день месяца, начиная с даты подписки.

Именно благодаря вашей помощи мы можем продолжать делать свою работу. 🙏

Выберите сумму для ежемесячного списания:
    `;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.url('100 ₽', 'https://gaoordi.link/VZUZx'),
        Markup.button.url('300 ₽', 'https://gaoordi.link/OLJVT'),
        Markup.button.url('500 ₽', 'https://gaoordi.link/m6Xvg')
      ],
      [
        Markup.button.url('1000 ₽', 'https://gaoordi.link/1iOZt'),
        Markup.button.url('3000 ₽', 'https://gaoordi.link/VZUZx'),
        Markup.button.url('5000 ₽', 'https://gaoordi.link/VZUZx')
      ],
      [Markup.button.url('10000 ₽', 'https://gaoordi.link/VZUZx')]
    ]);

    await ctx.replyWithMarkdown(message, keyboard);
  };

  // Поддержка команды /donate
  bot.command(command, sendDonateMessage);

  // Поддержка кнопки в меню
  bot.hears(keyboardText, sendDonateMessage);
};


