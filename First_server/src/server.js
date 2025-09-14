const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerSpec.js'); 
const sequelize = require('../src/config/db.js')
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


sequelize
  .authenticate()
  .then(() => {
    console.log('DB connected!')
  })
  .catch(err => console.log('error: ', err.message))

app.listen(PORT, () => console.log(`Запущен сервер на http://localhost:${PORT}`))