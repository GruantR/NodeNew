// Импорт необходимых модулей
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Инициализация Express и HTTP-сервера
const app = express();
const server = http.createServer(app);

// Инициализация Socket.io
const io = new Server(server);

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, "public", "publicWebSocket")));

// Обработчик подключения WebSocket
io.on("connection", (socket) => {
  console.log("Новое подключение");

  socket.
  // Обработчик установки никнейма
  socket.on("set_username", (username) => {
    // Проверка на пустой никнейм
    if (!username.trim()) {
      socket.emit("error", "Никнейм не может быть пустым");
      return;
    }
    
    // Сохраняем никнейм в объекте сокета
    socket.username = username.trim();
    
    // Уведомляем клиент об успешной авторизации
    socket.emit("username_accepted");
    
    // Уведомляем всех о новом пользователе
    io.emit("user_connected", socket.username);
  });

  // Обработчик входящих сообщений
  socket.on("message", (msg) => {
    // Проверяем, установлен ли никнейм
    if (!socket.username) {
      socket.emit("error", "Сначала выберите никнейм");
      return;
    }
    
    // Рассылаем сообщение всем клиентам
    io.emit("message", {
      user: socket.username,       // Никнейм отправителя
      text: msg,                   // Текст сообщения
      time: new Date().toLocaleTimeString() // Время отправки
    });
  });

  // Обработчик отключения клиента
  socket.on("disconnect", () => {
    // Если никнейм был установлен
    if (socket.username) {
      // Уведомляем всех об отключении
      io.emit("user_disconnected", socket.username);
    }
  });
});





// Запуск сервера на порту 3000
server.listen(3000, (socket) => {
  console.log("Сервер запущен на http://localhost:3000");
});

