const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");

class BooksServices {
  // Метод добавления (записи) новой книги в базу данных:
  async createBook(content) {
      return await FileHelper.writeFile("example.json", content);
  }

  // Метод для получения (чтения) списка ВСЕХ книг из БД: (массив объектов)
  async getBooks() {
    try {
      await FileHelper.checkFileExist("example.json"); // Проверили наличие нужного файла
      const result = await FileHelper.readFile("example.json");
      return result;
    }
    catch(error) {
      console.error('Ошибка:', error.message);
    }

  }
  // Метод для получения данных КОНКРЕТНОЙ выбранной по id книги: (объект)
  async getBookByID(id) {
    const findBook = await FileHelper.readFile("example.json");
    return findBook.books.find((item) => item.id === id);
  }

  // Метод для получения индекса КОНКРЕТНОЙ  выбранной книги из массива по id: (объект со значением индекса)
  async getIndexBookByID(id) {
    const findBook = await FileHelper.readFile("example.json");
    const findIndex = findBook.books.findIndex((item) => item.id === id);
    return { value: findIndex };
  }
}

module.exports = new BooksServices();
