const express = require("express");
const TodosServices = require("../services/todosServices");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

class TodosControllers {
  async getTodos(req, res) {
    const readFile = await TodosServices.getTodos();
    const result = readFile.todos;
    res.send(result);
  }
  async getTodosSpecificUser(req, res) {  
    const readFile = await TodosServices.getTodosSpecificUser(req.idUser);
    res.send(readFile)
    
  }


  async createTodos(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const readFile = await TodosServices.getTodos();
    const findTitleByBase = readFile.todos.filter(item => item.idUser === req.idUser).find(
      (item) => item.title === req.body.title
    );
    if (findTitleByBase) {
    return res.status(404).send("Ошибка, такое задание УЖО существует");
    }
    readFile.todos.push({ idTask: uuidv4(), ...req.body, idUser: req.idUser });
    const result = await TodosServices.createTodos(readFile);
    res.send(result);
  }
  async patchTitleTodos (req, res) {    
    const findIndexTodos = await TodosServices.getTodosByID(req.params.id)
    if (findIndexTodos.searchIdTodos < 0) {
        return res.status(401).json({message: "В базе нет задания с таким ID"})
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const readFile = await TodosServices.getTodos();
    const {title} = req.body;
    readFile.todos[findIndexTodos.searchIdTodos].title = title
    const result = await TodosServices.createTodos(readFile);
    res.send(result);
  }
  async patchIsCompletedTodos(req,res) {
    const findIndexTodos = await TodosServices.getTodosByID(req.params.id)
    if (findIndexTodos.searchIdTodos < 0) {
        return res.status(404).json({message: "Таска с указанным идентификатором не найдена"})
    }
    const readFile = await TodosServices.getTodos();
    const todo =  readFile.todos[findIndexTodos.searchIdTodos];
    todo.isCompleted = !todo.isCompleted;
    await TodosServices.createTodos(readFile);
    res.send("Статус задания изменён!");
  }
  async deleteTodosByID(req,res){
    const findIndexTodos = await TodosServices.getTodosByID(req.params.id)
    if (findIndexTodos.searchIdTodos < 0) {
        return res.status(404).json({message: "Таска с указанным идентификатором не найдена"})
    }
    const readFile = await TodosServices.getTodos();
    readFile.todos.splice(findIndexTodos.searchIdTodos,1)
    await TodosServices.createTodos(readFile);
    res.send('Таска удалена!')
  }

}
module.exports = new TodosControllers();
