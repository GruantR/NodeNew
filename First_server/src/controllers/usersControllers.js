const express = require("express");
const bcrypt = require("bcrypt");
const UsersServices = require("../services/usersServices");
const { v4: uuidv4 } = require("uuid"); // генератор id
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Sentry = require("@sentry/node");

class UsersControllers {
  // СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ (РЕГИСТРАЦИЯ): (CREATE)
  async createUsers(req, res) {
    try {
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
      const findEmailByBase = readFile.users.find(
        (item) => item.email === req.body.email
      );
      if (findEmailByBase) {
        return res
          .status(409)
          .send("Ошибка, пользователь с таким email УЖО существует");
      } else {
        // Добавляем нужный контент в файл и генерируем новый id:
        readFile.users.push({
          id: uuidv4(),
          ...req.body,
          password: hashedPassword,
        });
        // Перезаписываем файл:
        const result = await UsersServices.createUser(readFile);
        res.send(result);
      }
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
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {});
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
      //console.log("vfvfvf: ", req.idUser);
      const readFile = await UsersServices.getUsers();
      const result = readFile.users;
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

      // Искусственная ошибка для теста Sentry
     // throw new Error("Тестовая ошибка для Sentry: пользователь не найден!");

      if (result) {
        res.json(result);
        return res.status(404).send("В базе данных пользователь не найден!");
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

    const readFile = await UsersServices.getUsers();
    const objectIndexSearchElem = await UsersServices.getIndexUserByID(targetId);
    
    // Обновляем только переданные поля
    if (req.body.username) userList.username = req.body.username;
    if (req.body.email) userList.email = req.body.email;
    
    if (req.body.password) {
      const saltRounds = 10;
      userList.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    readFile.users.splice(objectIndexSearchElem.value, 1, userList);
    await UsersServices.createUser(readFile);
    
    res.send("Данные пользователя успешно обновлены");
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ message: "Ошибка обновления данных" });
  }
}



async updateUserData(req, res) {
  try {
    const targetId = req.params.id;
    const userList = await UsersServices.getUserByID(targetId);
    
    if (!userList) {
      return res.status(404).send("В базе данных пользователь не найден!");
    }

    const readFile = await UsersServices.getUsers();
    const objectIndexSearchElem = await UsersServices.getIndexUserByID(targetId);
    
    // Обновляем только переданные поля
    if (req.body.username) userList.username = req.body.username;
    if (req.body.email) userList.email = req.body.email;
    
    if (req.body.password) {
      const saltRounds = 10;
      userList.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    readFile.users.splice(objectIndexSearchElem.value, 1, userList);
    await UsersServices.createUser(readFile);
    
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
      if (userList) {
        // если нужный нам пользователь существуем, считываем файл:
        const readFile = await UsersServices.getUsers();
        // находим индекс нужного нам объекта в массиве:
        const objectIndexSearchElem = await UsersServices.getIndexUserByID(
          targetId
        );
        const saltRounds = 10;
        const password = await bcrypt.hash(req.body.password, saltRounds);
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
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка смены  пароля" });
    }
  }

  // Удаление конкретного пользователя: (DELETE)
  async deleteUser(req, res) {
    try {
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