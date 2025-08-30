const express = require("express");
const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const { ObjectId } = require("mongodb");


class TodosServices {
  #COLLECTION = "todos";

// Метод создания нового задания
  async createTodos(info) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).insertOne(info);
    connection.close();
    return info;
  }

// Метод получения списка всех заданий
  async getTodos() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).find({}).toArray();
    connection.close();
    return data


  }
// Метод получения конкретных тасок конкретного пользователя
  async getTodosSpecificUser(id){
    
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).find({userId: id}).toArray();
    connection.close();
    return data
  }

  // Метод получения таски по ее ID
  async getTodoById(id){
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).findOne({ _id: ObjectId.createFromHexString(id) });
    connection.close();
    return data
  }


  // Метод обновления данных пользователей:
  async updateTodoStatus(id, isCompleted) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: {completed: isCompleted, updatedAt: new Date()} }
      );
    connection.close();
    return data;
  }





    async getTodosByID(id) {
      const readFile = await FileHelper.readFile("example.json");
    return {searchIdTodos: readFile.todos.findIndex(item => item.idTask == id)};
    }
  
}
module.exports = new TodosServices();