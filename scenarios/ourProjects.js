const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.hears('Наши проекты', async (ctx) => {
    await ctx.reply(
      `ГАООРДИ системно и последовательно реализует программы, 
которые позволяют детям и взрослым с инвалидностью быть самостоятельными 
в открытом обществе, учиться и трудиться, дружить и заниматься творчеством, 
получать новые впечатления и просто быть счастливыми.`
    );

    await ctx.reply(
      'Выберите проект:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Сопровождаемое проживание', 'project_1')],
        [Markup.button.callback('Центр дневного пребывания', 'project_2')],
        [Markup.button.callback('Служба помощи людям с БАС', 'project_3')],
        [Markup.button.callback('«Не один дома»', 'project_4')],
        [Markup.button.callback('Трудовые мастерские', 'project_5')]
      ])
    );
  });
};

