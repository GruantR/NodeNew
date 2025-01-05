const e = require("express");
const UsersServices = require("../services/usersServices");
const { v4: uuidv4 } = require('uuid'); // генератор id

class UsersControllers {
  // Создание пользователь (create)
  createUsers(req, res) {
    const { id, username} = req.body;
    //UsersServices.createUser(req.body);
    const newId = uuidv4();
    UsersServices.createUser({id:newId,...req.body});
    res.send(`Пользователь ${username} успешно создан, присвоен id: ${newId}`);
  }

  // Получение списка всех пользователей (read)
  getUsers(req, res) {
    const result = UsersServices.getUsers();
    res.send(result);
  }

  // Получение информации о конкретном пользователе (read)
  getUserByID(req, res) {
    const targetId = req.params.id;
    const result = UsersServices.getUserByID(targetId);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Пользователь не найден");
    }
  }

  // Изменение конкретного пользователя (Update-PUT)
  updateUserData(req, res) {
    const targetId = req.params.id;
    const result = UsersServices.getUserByID(targetId);
    if (result) {
      const { username, email, password } = req.body;
      result.username = username;
      result.email = email;
      result.password = password;

      res.send(
        `Данные пользоователя зарегистрированного под id:${result.id} обновлены`
      );
    } else {
      res.status(404).send("Пользователь не найден");
    }
  }

  //Изменение пароля конкретного пользователя (Update-PATCH)
  updateUserPassword(req, res) {
    const targetId = req.params.id;
    const result = UsersServices.getUserByID(targetId);
    if (result) {
      const { password } = req.body;
      result.password = password;

      res.send(`Пароль пользователя под id:${result.id} обновлен`);
    } else {
      res.status(404).send("Пользователь не найден");
    }
  }

  // Удаление конкретного пользователя
  deleteUser(req, res) {
    const targetId = req.params.id;
    const indexTarget = UsersServices.getIndexUserByID(targetId)
    const {value} = indexTarget; 
    if (value >= 0) {
      const userList = UsersServices.getUsers();
      userList.splice(value, 1);
      res.send(`Пользователь удалён!`);
    } else {
      res.status(404).send("Пользователь не найден");
    }
  }
}

module.exports = new UsersControllers();
