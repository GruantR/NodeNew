const express = require("express");
const TodosServices = require("../services/todosServices")

class TodosControllers {
    async getTodos(req,res) {
    const readFile = await TodosServices.getTodos();
    const result = readFile.todos;
    res.send(result)
    }
  
    async createTodos (req,res) {
    const readFile = await TodosServices.getTodos();
    }

}
module.exports = new TodosControllers();