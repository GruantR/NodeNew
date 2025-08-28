const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const { ObjectId } = require("mongodb");
class UsersServices {
  #COLLECTION = "users";

  // Метод добавления (записи) новых пользователей:
  async createUser(info) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    await db.collection(this.#COLLECTION).insertOne(info);
    connection.close();
    return info;
  }
  // ВЕРСИЯ ДЛЯ ЧТЕНИЯ ИЗ ФАЙЛА examle
  // async createUser(content) {
  //    return await FileHelper.writeFile("example.json", content);
  //   }

// Метод обновления данных пользователей:
async updateData(id, updateData) {
  const connection = await getConnection();
  const db = useDefaultDb (connection);
  const data = await db.collection(this.#COLLECTION).updateOne({_id: ObjectId.createFromHexString(id)}, {$set :updateData})
  connection.close()
  return data
}


  // Метод для получения (чтения) списка ВСЕХ пользователей: (массив объектов)
  async getUsers() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).find({}).toArray();
    connection.close();
    return data;
  }
  // ВЕРСИЯ ДЛЯ ЧТЕНИЯ ИЗ ФАЙЛА examle
  // async getUsers() {
  //   const result = await FileHelper.readFile("example.json");
  //   return result;
  // }





  // Метод для получения данных КОНКРЕТНОГО пользователя по ID: (объект)
  async getUserByID(id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).findOne({_id: ObjectId.createFromHexString(id)});
    connection.close();
    return data;
  }
  // ВЕРСИЯ ДЛЯ ЧТЕНИЯ ИЗ ФАЙЛА examle
  // async getUserByID(id) {
  //   const findUser = await FileHelper.readFile("example.json");
  //   return findUser.users.find((item) => item.id === id);
  // }





  // Метод для получения данных КОНКРЕТНОГО пользователя по email: (объект)
  async getUserByEmail(email) {
    const collection = await getConnection();
    const db = useDefaultDb(collection);
    const data = await db.collection(this.#COLLECTION).findOne({email: email})
    return data;
  }
  // ВЕРСИЯ ДЛЯ ЧТЕНИЯ ИЗ ФАЙЛА examle
  // async getUserByEmail(email) {
  //   const findEmail = await FileHelper.readFileByEmail("example.json", email);
  //   return findEmail;
  // }










  // Метод для получения индекса КОНКРЕТНОГО пользователся в массиве по id: (объект со значением индекса)
  async getIndexUserByID(id) {
    const findUser = await FileHelper.readFile("example.json");
    const findIndex = findUser.users.findIndex((item) => item.id === id);
    return { value: findIndex };
  }
}

module.exports = new UsersServices();
