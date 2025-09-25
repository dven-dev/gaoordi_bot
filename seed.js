require('dotenv').config();
const mongoose = require('mongoose');
const Scenario = require('./models/Scenario');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Scenario.deleteMany({}); // очистить старые сценарии

  await Scenario.insertMany([
    {
      name: "Приветствие",
      steps: [
        "Отправьте сообщение 'Добро пожаловать!'",
        "Скажите своё имя",
        "Подтвердите данные"
      ]
    },
    {
      name: "Поддержка",
      steps: [
        "Выберите сумму пожертвования",
        "Подтвердите оплату",
        "Спасибо за вашу поддержку!"
      ]
    }
  ]);

  console.log("✅ Сценарии добавлены");
  mongoose.disconnect();
});
