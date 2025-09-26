const { Markup } = require('telegraf');

module.exports = (bot) => {
  const keyboardText = 'Наши проекты';
  const command = 'projects';

  bot.command(command, async (ctx) => {
    await ctx.reply(
      'ГАООРДИ системно и последовательно реализует программы, которые позволяют детям и взрослым с инвалидностью быть самостоятельными в открытом обществе, учиться и трудиться, дружить и заниматься творчеством, получать новые впечатления и просто быть счастливыми.',
      Markup.inlineKeyboard([
        [Markup.button.callback('Сопровождаемое проживание', 'projects_1')],
        [Markup.button.callback('Центр дневного пребывания', 'projects_2')],
        [Markup.button.callback('Служба помощи людям с БАС', 'projects_3')],
        [Markup.button.callback('«Не один дома»', 'projects_4')],
        [Markup.button.callback('Трудовые мастерские', 'projects_5')]
      ])
    );
  });

  bot.hears(keyboardText, async (ctx) => {
    await ctx.reply(
      'ГАООРДИ системно и последовательно реализует программы, которые позволяют детям и взрослым с инвалидностью быть самостоятельными в открытом обществе, учиться и трудиться, дружить и заниматься творчеством, получать новые впечатления и просто быть счастливыми.',
      Markup.inlineKeyboard([
        [Markup.button.callback('Сопровождаемое проживание', 'projects_1')],
        [Markup.button.callback('Центр дневного пребывания', 'projects_2')],
        [Markup.button.callback('Служба помощи людям с БАС', 'projects_3')],
        [Markup.button.callback('«Не один дома»', 'projects_4')],
        [Markup.button.callback('Трудовые мастерские', 'projects_5')]
      ])
    );
  });
};
