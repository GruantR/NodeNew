const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerSpec.js'); 
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
app.listen(PORT, () => {
  console.log(`Запущен сервер на http://localhost:${PORT}`);
});

