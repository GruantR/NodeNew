const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
class UsersServices {
  #COLLECTION = "users";

  // Метод добавления (записи) новых пользователей:
  async createUser(info) {
    const newUser = new User(info);
    const result = await newUser.save();
    return result;
  }

  // Метод обновления данных пользователей:
  async updateData(id, updateData) {
    const data = await User.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: updateData }
    );
    return data;
  }

  // Метод удаления пользователей из базы по id:
  async deleteData(id) {
    const data = await User.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });
    return data;
  }

  // Метод для получения (чтения) списка ВСЕХ пользователей:
  async getUsers() {
    const users = await User.find({});
    return users;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по ID: (объект)
  async getUserByID(id) {
    const data = await User.findOne({ _id: ObjectId.createFromHexString(id) });
    return data;
  }

  // Метод проверки наличия логина и емейла при регистрации:
  async validateRegistrationData(newEmail, newUserName) {
    const data = await User.findOne({
      $or: [{ email: newEmail }, { username: newUserName }],
    });
    return data;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по email: (объект)
  async getUserByEmail(email) {
    const data = await User.findOne({ email: email });
    return data;
  }
}

module.exports = new UsersServices();
