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

  // Метод обновления данных пользователей:
  async updateData(id, updateData) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updateData }
      );
    connection.close();
    return data;
  }

  // Метод удаления пользователей из базы по id:
  async deleteData(id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .deleteOne({ _id: ObjectId.createFromHexString(id) });
    connection.close();
    return data;
  }

  // Метод для получения (чтения) списка ВСЕХ пользователей: 
  async getUsers() {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db.collection(this.#COLLECTION).find({}).toArray();
    connection.close();
    return data;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по ID: (объект)
  async getUserByID(id) {
    const connection = await getConnection();
    const db = useDefaultDb(connection);
    const data = await db
      .collection(this.#COLLECTION)
      .findOne({ _id: ObjectId.createFromHexString(id) });
    connection.close();
    return data;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по email: (объект)
  async getUserByEmail(email) {
    const collection = await getConnection();
    const db = useDefaultDb(collection);
    const data = await db
      .collection(this.#COLLECTION)
      .findOne({ email: email });
    return data;
  }
}

module.exports = new UsersServices();
