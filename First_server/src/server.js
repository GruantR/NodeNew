const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./routes");

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
// тест
