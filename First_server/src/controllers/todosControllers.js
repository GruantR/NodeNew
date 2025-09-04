const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const TodosServices = require("../services/todosServices");
const checkTaskOwnership = require("../helpers/taskOwnershipMiddleware");

class TodosControllers {
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
      // Проверка принадлежности задачи
      const task = await checkTaskOwnership.checkTaskAccess(taskId, userId);
      //Если все проверки пройдены, обновляем заголовок
      const updateFields = {};
      if (req.body.title) updateFields.title = req.body.title;

      await TodosServices.updateTodoTitle(taskId, updateFields);
      res.send("Задача успешно переименована");
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 404) {
        return res.status(error.statusCode).send(error.message);
      }
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
      const task = await checkTaskOwnership.checkTaskAccess(taskId, userId);
      const newCompletedStatus = !task.completed;
      await TodosServices.updateTodoStatus(taskId, newCompletedStatus);
      res.send("Статус задачи успешно изменён");
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 404) {
        return res.status(error.statusCode).send(error.message);
      }
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
      const task = await checkTaskOwnership.checkTaskAccess(taskId, userId);
      //Если все проверки пройдены, удаляем задачу
      await TodosServices.deleteTodo(taskId);
      res.send("Задача успешно удалена");
    } catch (error) {
      if (error.statusCode === 403 || error.statusCode === 404) {
        return res.status(error.statusCode).send(error.message);
      }
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
