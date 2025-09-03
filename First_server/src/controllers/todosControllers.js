const express = require("express");
const TodosServices = require("../services/todosServices");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

class TodosControllers {
  // Потом отвлекись и изучи еще раз эту шляпу
  constructor() {
    this.patchTitleTodos = this.patchTitleTodos.bind(this);
    this._validateTaskAccess = this._validateTaskAccess.bind(this);
    this._handleError = this._handleError.bind(this);
    this.patchIsCompletedTodos = this.patchIsCompletedTodos.bind(this);
    this.deleteTodosByID = this.deleteTodosByID.bind(this);
  }

  // Вспомогательный метод для проверки прав доступа к задаче
  async _validateTaskAccess(taskId, userId) {
    // 1. Получаем задачу по ID
    const task = await TodosServices.getTodoById(taskId);

    // 2. Если задача не найдена
    if (!task) {
      throw new Error("TASK_NOT_FOUND");
    }

    // 3. Проверяем, принадлежит ли задача пользователю
    if (task.user.toString() !== userId) {
      throw new Error("ACCESS_DENIED");
    }
    return task;

    // Код mongoDB
    // const taskId = req.params.id;
    // const userId = req.userId;

    // // 1. Получаем задачу по ID
    // const task = await TodosServices.getTodoById(taskId);

    // // 2. Если задача не найдена
    // if (!task) {
    //   return res.status(404).send("Таска с указанным идентификатором не найдена");
    // }

    // // 3. Проверяем, принадлежит ли задача пользователю
    // if (task.userId.toString() !== userId) {
    //   return res.status(403).send("Нет доступа к этой задаче");
    // }

    // // 4. Если все проверки пройдены, обновляем заголовок
    // const updateFiles = {};
    //   if (req.body.title) updateFiles.title = req.body.title;

    // await TodosServices.updateTodoTitle(taskId, updateFiles);
    // res.send("Задача успешно переименована");
  }
  // Универсальный обработчик ошибок
  _handleError(error, res) {
    if (error.message === "TASK_NOT_FOUND") {
      return res
        .status(404)
        .send("Таска с указанным идентификатором не найдена");
    } else if (error.message === "ACCESS_DENIED") {
      return res.status(403).send("Доступ запрещен");
    } else {
      console.error(error); // Логируем неожиданные ошибки
      return res.status(500).send("Внутренняя ошибка сервера");
    }
  }

  // Метод получения всех тасок ВСЕХ ВСЕХ ВСЕХ пользователей

  async getTodos(req, res) {
    const result = await TodosServices.getTodos();
    res.send(result);
  }

  // Метод получения конкретных тасок конкретного пользователя
  async getTodosSpecificUser(req, res) {
    const result = await TodosServices.getTodosSpecificUser(req.userId);
    res.send(result);
  }

  // Метод создания новый тасок
  async createTodos(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.userId) {
      return res
        .status(401)
        .json({ error: "Пользователь не аутентифицирован" });
    }

    const newTodo = {
      ...req.body,
      user: req.userId, // ID пользователя из middleware
      completed: false, // по умолчанию задача не выполнена
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      // Сервис получает готовые данные для сохранения
      const result = await TodosServices.createTodos(newTodo);
      res.status(201).send(result);
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  // Метод изменения названия (переименовать) задания
  async patchTitleTodos(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.userId;
      const task = await this._validateTaskAccess(taskId, userId);
      //Если все проверки пройдены, обновляем заголовок
      const updateFiles = {};
      if (req.body.title) updateFiles.title = req.body.title;

      await TodosServices.updateTodoTitle(taskId, updateFiles);
      res.send("Задача успешно переименована");
    } catch (error) {
      this._handleError(error, res); // Используем обработчик

      // Отправляем ошибку в Sentry
      Sentry.captureException(error, {
        extra: {
          targetId: req.params.id,
          userId: req.userId,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(500).json({ message: "Ошибка сервера при обновлении задачи" });
    }
  }

  // Метод изменения статуса задания
  async patchIsCompletedTodos(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.userId;
      const task = await this._validateTaskAccess(taskId, userId);
      const newCompletedStatus = !task.completed;
      await TodosServices.updateTodoStatus(taskId, newCompletedStatus);
      res.send("Статус задачи успешно изменён");
    } catch (error) {
      this._handleError(error, res); // Используем обработчик

      // Отправляем ошибку в Sentry
      Sentry.captureException(error, {
        extra: {
          targetId: req.params.id,
          userId: req.userId,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(500).json({ message: "Ошибка сервера при обновлении задачи" });
    }
  }

  // Метод удаления таски
  async deleteTodosByID(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.userId;

      const task = await this._validateTaskAccess(taskId, userId);

      //Если все проверки пройдены, удаляем задачу
      await TodosServices.deleteTodo(taskId);
      res.send("Задача успешно удалена");
    } catch (error) {
      this._handleError(error, res); // Используем обработчик

      // Отправляем ошибку в Sentry
      Sentry.captureException(error, {
        extra: {
          targetId: req.params.id,
          userId: req.userId,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(500).json({ message: "Ошибка сервера при удалении задачи" });
    }
  }
}
module.exports = new TodosControllers();
