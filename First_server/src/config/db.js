// //db.js
// const Sequelize = require('sequelize')
// require("dotenv").config();


// const sequelize = new Sequelize(
//   process.env.DATABASE,
//   process.env.DB_USER,
//   process.env.PASSWORD,
//   {
//     host: process.env.HOST,
//     dialect: process.env.DIALECT,
//     logging: (msg) => {
//       // Выводим только SQL-запросы, игнорируем метаданные
//       if (msg.includes('SELECT') || msg.includes('INSERT') || msg.includes('UPDATE') || msg.includes('DELETE')) {
//         console.log(msg);
//       }
//     },
//   }
// );

// module.exports = sequelize




// db.js
const Sequelize = require('sequelize');
require("dotenv").config();

// Создаем экземпляр Sequelize, используя полную строку подключения
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Это необходимо для подключения к Neon
    }
  },
  logging: (msg) => {
    // Выводим только SQL-запросы, игнорируем метаданные
    if (msg.includes('SELECT') || msg.includes('INSERT') || msg.includes('UPDATE') || msg.includes('DELETE')) {
      console.log(msg);
    }
  },
});

module.exports = sequelize;