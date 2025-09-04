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
  dsn: process.env.SENTRY_DSN,
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
