const express = require("express");
const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");

class TodosServices {
 // Метод для получения (чтения) списка ВСЕХ пользователей: (массив объектов)
  async getTodos() {
    const result = await FileHelper.readFile("example.json");
    return result;
  }
}
module.exports = new TodosServices();