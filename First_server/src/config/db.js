const mongoose = require('mongoose')
const Sequelize = require('sequelize')
require("dotenv").config();

//const MONGO_URL = `${process.env.MONGO_CONNECTION_STRING}/${process.env.MONGO_DB_NAME}`//Запуск БД на локальной машине
//const MONGO_URL = `${process.env.MONGO_URL}` //Запуск БД на сервере Mongo
//console.log('MONGO_URL:', MONGO_URL)

// async function connectDb () {
//   try {
//     await mongoose.connect(MONGO_URL)
//     console.log('Successful connection to MongoDb')
//   } catch (err) {
//     console.log(err)
//   }
// }


const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  }
);

//module.exports = connectDb
module.exports = sequelize