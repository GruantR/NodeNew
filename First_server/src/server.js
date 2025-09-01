const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerSpec.js'); 
const mongoose = require('mongoose');
const connectDb = require('./config/db.js')
const app = express();
const Sentry = require("@sentry/node");
require("dotenv").config();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const router = require("./routes");

Sentry.init({
  dsn: "https://80704a0f84379958518ea4546dc6a291@o4508728311087104.ingest.de.sentry.io/4508733683138640",
  // Другие опции настройки
});

// Middleware для Логирования
function logger(req, res, next) {
  console.log(`Запрос на ${req.url}`);
  next();
}
app.use(logger);

app.use(express.json());
app.use("/api", router);


const PORT = process.env.PORT;
connectDb()

mongoose.connection.once('open', () => {
  console.log('Connect mongoose DB')
  app.listen(PORT, () => console.log(`Запущен сервер на http://localhost:${PORT}`))
})

// app.listen(PORT, () => {
//   console.log(`Запущен сервер на http://localhost:${PORT}`);
// });

// Быстрый ввод BODY USER>
// {
//     "id":"1",
//     "username": "Masha",
//     "email":"ruslanusrulit@gmail.com",
//     "password":"Qwe123"
// }

// Быстрый ввод BODY BOOKS>
// {
//     "id":"1",
//     "bookname": "Masha i medved",
//     "author":"Stepan",
//     "pages":"123"
// }
// Быстрый ввод todos
// {
//     "title": "GoToSleep",
//     "isCompleted":"false"
// }
// тест11111116666
