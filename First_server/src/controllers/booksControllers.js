const express = require("express");
const BooksServices = require("../services/booksServices");
const { validationResult } = require('express-validator');
class booksControllers {

  //Создание книги: (create)
  async createBook(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, username } = req.body;
    const readFile = await BooksServices.getBooks();
    readFile.books.push({ /*id:newId,*/ ...req.body });
    const result = await BooksServices.createBook(readFile);
    res.send(result);
  }

  // Получение списка всех книг из базы данных: (read)
  async getBooks(req, res) {
    const readFile = await BooksServices.getBooks();
    const result = readFile.books;
    res.send(result);
  }

  // Получение информации о выбранной книге по id (read)
  async getBookByID(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const targetId = req.params.id;
    const result = await BooksServices.getBookByID(targetId);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send("В базе данных запрашиваемая книга не найдена");
    }
  }


  // Изменение выбранной книги (Update-PUT)
  async updateBook(req, res) {
    const targetId = req.params.id;
    const bookList = await BooksServices.getBookByID(targetId);
    if (bookList) {
      const readFile = await BooksServices.getBooks();
      const objectIndexSearchElem = await BooksServices.getIndexBookByID(
        targetId
      );
      const { bookname, author, page } = req.body;
      Object.assign(bookList, { bookname, author, page });
      readFile.books.splice(objectIndexSearchElem.value, 1, bookList);
      const result = await BooksServices.createBook(readFile);
      res.send(result);
    } else {
      res.status(404).send("В базе данных запрашиваемая книга не найдена");
    }
  }
  async deleteBook(req, res) {
    const targetId = req.params.id;
    const { value } = await BooksServices.getIndexBookByID(targetId);
    if (value >= 0) {
      const readFile = await BooksServices.getBooks();
      readFile.books.splice(value, 1);
      await BooksServices.createBook(readFile);
      res.send(`Книга удалена!`);
    } else {
      res.status(404).send("В базе данных запрашиваемая книга не найдена");
    }
  }
}

module.exports = new booksControllers();
