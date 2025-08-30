const express = require("express");
const bcrypt = require("bcrypt");
const UsersServices = require("../services/usersServices");
const { v4: uuidv4 } = require("uuid"); // генератор id
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Sentry = require("@sentry/node");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const { ObjectId } = require('mongodb');

class UsersControllers {
  // СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ (РЕГИСТРАЦИЯ): (CREATE)
  async createUsers(req, res) {
    try {
      // Проверка валидации осуществляется в роутах

      // Хешируем пароль от плохих дядек:
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = {
        // id: uuidv4(), это был id для работы в текстовом редакторе
        ...req.body,
        password: hashedPassword,
      };
      await UsersServices.createUser(newUser);

      // Отправляем успешное сообщение
      res.status(201).json({
        message: "Пользователь успешно зарегистрирован",
        "Присвоен следующий id: ": newUser._id,
      });
    } catch (error) {
      // Логируем ошибку в Sentry
      Sentry.captureException(error);

      // Возвращаем ошибку пользователю
      return res
        .status(500)
        .json({ message: "Произошла ошибка при регистрации" });
    }
  }

  // ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ:
  async loginUser(req, res) {
    try {
      // Проверка ошибок валидации:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //
      const { email, password } = req.body;
      // Проверка наличия email
      const user = await UsersServices.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Неверный email или пароль" });
      }
      // проверка наличия пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Неверный email или пароль" });
      }
      // Создание JWT-токена:
      const token = jwt.sign({ userId: user._id.toString() }, process.env.SECRET_KEY, {expiresIn: "24h" }); 
      res.send({ token });
    } catch (error) {
      Sentry.captureException(error, {
        // Теги для фильтрации в Sentry (например, "controller: users")
        tags: { controller: "UsersControllers" },

        // Дополнительные данные
        extra: {
          endpoint: req.path, // Например, "/api/login"
          body: req.body, // Что передал пользователь (email/password)
          userId: user?.id, // Если user существует
        },
      });

      return res.status(500).json({ message: "Ошибка авторизации" });
    }
  }

  // ПОЛУЧЕНИЕ (ЧТЕНИЕ) СПИСКА ВСЕХ ПОЛЬЗОВАТЕЛЕЙ: (READ)

  async getUsers(req, res) {
    try {
      const result = await UsersServices.getUsers();
      res.send(result);
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка получения пользователей" });
    }
  }

  // Получение информации о конкретном пользователе: (read)
  async getUserByID(req, res) {
    try {
      const targetId = req.params.id;
      const result = await UsersServices.getUserByID(targetId);
      if (result) {
        res.json(result);
      } else {
        res.status(404).send("В базе данных пользователь не найден!");
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          targetId: req.params.id,
          timestamp: new Date().toISOString(),
        },
      });
      res.status(500).json({ message: "Ошибка поиска пользователя" });
    }
  }

  // Изменение конкретного пользователя: (Update-PUT)
  async updateUserData(req, res) {
    try {
      const targetId = req.params.id;
      const userList = await UsersServices.getUserByID(targetId);

      if (!userList) {
        return res.status(404).send("В базе данных пользователь не найден!");
      }
      const updateFiles = {};
      // Обновляем только переданные поля
      if (req.body.username) updateFiles.username = req.body.username;
      if (req.body.email) updateFiles.email = req.body.email;
      if (req.body.password) {
        const saltRounds = 10;
        updateFiles.password = await bcrypt.hash(req.body.password, saltRounds);
      }
      const result = await UsersServices.updateData(targetId, updateFiles);

      res.send("Данные пользователя успешно обновлены");
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка обновления данных" });
    }
  }

  //Изменение пароля конкретного пользователя: (Update-PATCH)
  async updateUserPassword(req, res) {
    try {
      const targetId = req.params.id;
      const userList = await UsersServices.getUserByID(targetId);
      if (!userList) {
        return res.status(404).send("В базе данных пользователь не найден!");
      }
      const updateFiles = {};
      // Обновляем только переданные поля
      if (req.body.password) {
        const saltRounds = 10;
        updateFiles.password = await bcrypt.hash(req.body.password, saltRounds);
      }
      await UsersServices.updateData(targetId, updateFiles);
      res.send("пароль успешно обновлен");
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка смены  пароля" });
    }
  }

  // Удаление конкретного пользователя: (DELETE)
  async deleteUser(req, res) {
    try {
      const targetId = req.params.id;
      const userList = await UsersServices.getUserByID(targetId);

      if (!userList) {
        return res.status(404).send("В базе данных пользователь не найден!");
      }
      await UsersServices.deleteData(targetId, userList);
      res.send(`Выбранный пользователь удалён! - он не достоин!!!`);
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка удааления пользователя" });
    }
  }
}

function sum(a, b) {
  return a + b;
}
// module.exports = sum;
// module.exports = new UsersControllers();

module.exports = {
  sum,
  UsersControllers: new UsersControllers(),
};
