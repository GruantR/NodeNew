const express = require("express");
const bcrypt = require("bcrypt");
const UsersServices = require("../services/usersServices");
const { v4: uuidv4 } = require("uuid"); // генератор id
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

class UsersControllers {
  // СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ: (CREATE)
  async createUsers(req, res) {
    // Проверка ошибок валидации:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Хешируем пароль от плохих дядек:
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // Считываем содержимое файла:
    const readFile = await UsersServices.getUsers();
    // Проверка наличия email в базе:
    const findEmailByBase = readFile.users.find(item => item.email === req.body.email);
    if (findEmailByBase) {
      res.status(404).send("Ошибка, пользователь с таким email УЖО существует");
    }
    else {
    // Добавляем нужный контент в файл и генерируем новый id:
    readFile.users.push({ id: uuidv4(), ...req.body, password: hashedPassword });
    // Перезаписываем файл:
    const result = await UsersServices.createUser(readFile);
    res.send(result); 
    }

  }

  // ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ:
   async loginUser (req,res) {
        // Проверка ошибок валидации:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        //
        const {email,password} = req.body;        
        // Проверка наличия email
        const user = await UsersServices.getUserByEmail(email);
        if (!user) {
          return res.status(401).json({message: "Неверный email или пароль"})
        }
        // проверка наличия пароля
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return res.status(401).json({message: "Неверный email или пароль"})
        }
        // Создание JWT-токена:
        const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY, {})
        res.send({token})

   }

  // ПОЛУЧЕНИЕ (ЧТЕНИЕ) СПИСКА ВСЕХ ПОЛЬЗОВАТЕЛЕЙ: (READ)
  async getUsers(req, res) {
   console.log("vfvfvf: ",req.userIdd);
    
    const readFile = await UsersServices.getUsers();
    const result = readFile.users;
    res.send(result)
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
