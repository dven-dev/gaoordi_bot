const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'О нас ℹ️';
  const command = 'about';

  const sendAboutMessage = async (ctx) => {
    const message = `
🏛 *О нас*

С 1992 года ГАООРДИ объединяет организации, представляющие интересы детей и взрослых людей с инвалидностью, их семей и помогающих специалистов.  

Ассоциация содействует развитию социальной и реабилитационной помощи людям с редкими генетическими заболеваниями.  

Ключевые направления работы ГАООРДИ — сопровождаемое проживание, содействие трудоустройству и занятости молодых людей с инвалидностью, социальный патронаж семей, имеющих детей с тяжёлыми нарушениями развития, обмен опытом с другими НКО.
    `;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('Об ассоциации', 'https://gaoordi.ru')]
    ]);

    await ctx.replyWithMarkdown(message, keyboard);
  };

  bot.command(command, sendAboutMessage);
  bot.hears(keyboardText, sendAboutMessage);
};
