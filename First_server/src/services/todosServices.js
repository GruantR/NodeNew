const express = require("express");
const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");

class TodosServices {
 // Метод для получения (чтения) списка ВСЕХ пользователей: (массив объектов)
  async getTodos() {
    const result = await FileHelper.readFile("example.json");
    return result;
  }
  async createTodos(content) {
    return await FileHelper.writeFile("example.json", content);
  }
    async getTodosByID(id) {
      const readFile = await FileHelper.readFile("example.json");
    return {searchIdTodos: readFile.todos.findIndex(item => item.idTask == id)};
    }
  
}
module.exports = new TodosServices();