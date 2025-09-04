const express = require("express");
const fs = require("fs");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const { ObjectId } = require("mongodb");
const Todos = require("../models/Todo");
const FileHelper = require("../helpers/fileHelper");

class TodosServices {
  #COLLECTION = "todos";

  // Метод создания нового задания
  async createTodos(info) {
    const newTodo = new Todos(info);
    const result = await newTodo.save();
    return result;
  }

  // Метод получения списка всех заданий
  async getTodos() {
    const todos = await Todos.find({}).populate("user");
    return todos;
  }
  // Метод получения конкретных тасок конкретного пользователя
  async getTodosSpecificUser(id) {
    const data = await Todos.find({ user: id });
    return data;
  }

  // Метод получения таски по ее ID
  async getTodoById(id) {
    const data = await Todos.findOne({ _id: ObjectId.createFromHexString(id) });
    return data;
  }

  // Метод обновления статуса выполнения таски:
  async updateTodoStatus(taskId, isCompleted) {
    const data = await Todos.updateOne(
      { _id: ObjectId.createFromHexString(taskId) },
      { $set: { completed: isCompleted, updatedAt: new Date() } }
    );

    return data;
  }

  // Метод изменения (переименовать) названия задания:
  async updateTodoTitle(id, updateData) {
    const updateWithTimestamp = {
      ...updateData,
      updatedAt: new Date(), // Всегда устанавливаем текущую дату/время
    };
    const data = Todos.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: updateWithTimestamp }
    );
    return data;
  }

  // Метод удаления таски по id:
  async deleteTodo(taskId) {
    const data = Todos.deleteOne({ _id: ObjectId.createFromHexString(taskId) });
    return data;
  }
}
module.exports = new TodosServices();
