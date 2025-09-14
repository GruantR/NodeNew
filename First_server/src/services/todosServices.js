// todosServices.js
const express = require("express");
const {Todo} = require('../models/models')

class TodosServices {
  #COLLECTION = "todos";

  // Метод создания нового задания
  async createTodos(info) {
    const newTodo = await Todo.create(info)
    return newTodo;
  }

  // Метод получения списка всех заданий
  async getTodos() {
    const todos = await Todo.findAll({});
    return todos;
  }
  // Метод получения конкретных тасок конкретного пользователя
  async getTodosSpecificUser(id) {
    const data = await Todo.findAll({where: { userID: id }});
    return data;
  }

  // Метод получения таски по ее ID
  async getTodoById(id) {
    const data = await Todo.findByPk(id);
    return data;
  }

  // Метод обновления статуса выполнения таски:
  async updateTodoStatus(id, isCompleted) {
    const data = await Todo.update({status:isCompleted}, {where: {id}});
    
    return data;
  }

  // Метод изменения (переименовать) названия задания:
  async updateTodoTitle(id, updateData) {
    const data = Todo.update(updateData, {where: {id}});
    return data;
  }

  // Метод удаления таски по id:
  async deleteTodo(id) {
    const data = Todo.destroy({where: {id}});
    return data;
  }
}
module.exports = new TodosServices();
