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

// //  Создать маршрут для обработки HTTP GET-запроса по пути **`/api/hello`**, который возвращает простое сообщение `"Привет, Redev!"`.
// app.get('/api/hello', (req,res)=>{
// res.send("Привет, Redev!")
// });

// // Создать маршрут для обработки HTTP POST-запроса по пути /api/echo, который принимает JSON-объект с ключом "message" в теле запроса и возвращает этот текст как ответ.
// app.post('/api/echo', (req,res)=>{
//     res.send(req.body.message);
// })

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Запущен сервер на http://localhost:${PORT}`);
});

// Быстрый ввод BODY>
// {
//     "id":"1",
//     "username": "Masha",
//     "email":"ruslanusrulit@gmail.com",
//     "password":"Qwe123"
// }
