const express = require("express");
const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");

class TodosServices {

  async getTodos() {
    const result = await FileHelper.readFile("example.json");
    return result;
  }

  async getTodosSpecificUser(id){
    
    const readFile = await FileHelper.readFile("example.json");
    return readFile.todos.filter(item => item.idUser === id)
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