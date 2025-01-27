const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");
class UsersServices {
  // Метод добавления (записи) новых пользователей:
  async createUser(content) {
    return await FileHelper.writeFile("example.json", content);
  }

  // Метод для получения (чтения) списка ВСЕХ пользователей: (массив объектов)
  async getUsers() {
    const result = await FileHelper.readFile("example.json");
    return result;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по ID: (объект)
  async getUserByID(id) {
    const findUser = await FileHelper.readFile("example.json");
    return findUser.users.find((item) => item.id === id);
  }

   // Метод для получения данных КОНКРЕТНОГО пользователя по email: (объект)
   async getUserByEmail(email) {
    const findEmail = await FileHelper.readFileByEmail("example.json",email);
    return findEmail;
  }

  // Метод для получения индекса КОНКРЕТНОГО пользователся в массиве по id: (объект со значением индекса)
  async getIndexUserByID(id) {
    const findUser = await FileHelper.readFile("example.json");
    const findIndex = findUser.users.findIndex((item) => item.id === id);
    return { value: findIndex };
  }
}

module.exports = new UsersServices();
