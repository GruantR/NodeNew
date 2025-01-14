const express = require("express");
const UsersServices = require("../services/usersServices");
const { v4: uuidv4 } = require("uuid"); // генератор id

class UsersControllers {
  // Создание пользователя: (create)
  async createUsers(req, res) {
    const { id, username } = req.body;
    // Генерируем новый id:
    const newId = uuidv4();
    // Считываем содержимое файла:
    const readFile = await UsersServices.getUsers();
    // Добавляем нужный контент в файл:
    readFile.users.push({ /*id:newId,*/ ...req.body });
    // Перезаписываем файл:
    const result = await UsersServices.createUser(readFile);
    res.send(result);
  }

  // Получение списка всех пользователей: (read)
  async getUsers(req, res) {
    const readFile = await UsersServices.getUsers();
    const result = readFile.users;
    res.send(result);
  }

  // Получение информации о конкретном пользователе: (read)
  async getUserByID(req, res) {
    const targetId = req.params.id;
    const result = await UsersServices.getUserByID(targetId);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("В базе данных пользователь не найден!");
    }
  }

  // Изменение конкретного пользователя: (Update-PUT)
  async updateUserData(req, res) {
    const targetId = req.params.id;
    const userList = await UsersServices.getUserByID(targetId);
    if (userList) {
      // если нужный нам пользователь существуем, считываем файл:
      const readFile = await UsersServices.getUsers();
      // находим индекс нужного нам пользователя (объекта) в массиве:
      const objectIndexSearchElem = await UsersServices.getIndexUserByID(
        targetId
      );
      const { username, email, password } = req.body;
      // обновляем выбранный объект новыми параметрами из body:
      Object.assign(userList, { username, email, password });
      // в считанном файле заменяем старый объект на обновленный:
      readFile.users.splice(objectIndexSearchElem.value, 1, userList);
      // перезаписываем файл:
      await UsersServices.createUser(readFile);
      res.send("Файл успешно обнолен");
    } else {
      res.status(404).send("В базе данных пользователь не найден!");
    }
  }

  //Изменение пароля конкретного пользователя: (Update-PATCH)
  async updateUserPassword(req, res) {
    const targetId = req.params.id;
    const userList = await UsersServices.getUserByID(targetId);
    if (userList) {
      // если нужный нам пользователь существуем, считываем файл:
      const readFile = await UsersServices.getUsers();
      // находим индекс нужного нам объекта в массиве:
      const objectIndexSearchElem = await UsersServices.getIndexUserByID(
        targetId
      );
      const { password } = req.body;
      // обновляем выбранный объект новыми параметрами из body:
      Object.assign(userList, { password });
      // в считанном файле заменяем старый объект на обновленный:
      readFile.users.splice(objectIndexSearchElem.value, 1, userList);
      // перезаписываем файл:
      await UsersServices.createUser(readFile);
      res.send("Информация о выбранном пользователе успешно обновлена!");
    } else {
      res.status(404).send("В базе данных пользователь не найден!");
    }
  }

  // Удаление конкретного пользователя: (DELETE)
  async deleteUser(req, res) {
    const targetId = req.params.id;
    const { value } = await UsersServices.getIndexUserByID(targetId);
    if (value >= 0) {
      const readFile = await UsersServices.getUsers();
      readFile.users.splice(value, 1);
      await UsersServices.createUser(readFile);
      res.send(`Выбранный пользователь удалён! - он не достоин!!!`);
    } else {
      res.status(404).send("В базе данных пользователь не найден!");
    }
  }
}

module.exports = new UsersControllers();
