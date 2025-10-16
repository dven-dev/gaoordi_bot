const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Контакты';
  const command = 'contacts';

  const sendContactsMessage = async (ctx) => {
    const message = `
🏢 *Контакты ГАООРДИ*

📍 *Наш адрес:*  
192131, г. Санкт-Петербург,  
пр. Обуховской Обороны, д. 199  
ст. м. Пролетарская  

🕓 *Режим работы:*  
ПН–ВС, с 9:00 до 20:00  

📞 *Телефоны:*  
+7 (812) 362-76-79  
+7 (812) 362-76-78  

✉️ *E-mail:*  
gaoordi@gaoordi.ru
    `;

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('📍 Открыть на карте', 'https://yandex.ru/maps/-/CDqKc6qT')],
      [Markup.button.url('✉️ Написать на почту', 'mailto:gaoordi@gaoordi.ru')],
      [Markup.button.webApp('🌐 Сайт ГАООРДИ', 'https://gaoordi.ru')]
    ]);

    await ctx.replyWithMarkdown(message, keyboard);
  };

  bot.command(command, sendContactsMessage);
  bot.hears(keyboardText, sendContactsMessage);
};
