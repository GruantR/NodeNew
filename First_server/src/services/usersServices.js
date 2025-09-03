const fs = require("fs");
const FileHelper = require("../helpers/fileHelper");
const { getConnection, useDefaultDb } = require("../helpers/mongoHelper");
const { ObjectId } = require("mongodb");
const User = require("../models/User")
class UsersServices {
  #COLLECTION = "users";

  // Метод добавления (записи) новых пользователей:
  async createUser(info) {
    const newUser = new User(info);
    const result = await newUser.save()

    // Код MongoDB
    // const connection = await getConnection();
    // const db = useDefaultDb(connection);
    // await db.collection(this.#COLLECTION).insertOne(info);
    // connection.close();
    return result;
  }

  // Метод обновления данных пользователей:
  async updateData(id, updateData) {
    const data = await User
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updateData }
      );
    return data;


    // Код MongoDB
    // const connection = await getConnection();
    // const db = useDefaultDb(connection);
    // const data = await db
    //   .collection(this.#COLLECTION)
    //   .updateOne(
    //     { _id: ObjectId.createFromHexString(id) },
    //     { $set: updateData }
    //   );
    // connection.close();
    // return data;
  }

  // Метод удаления пользователей из базы по id:
  async deleteData(id) {
    const data = await User
      .deleteOne({ _id: ObjectId.createFromHexString(id) });
    return data;


    // const connection = await getConnection();
    // const db = useDefaultDb(connection);
    // const data = await db
    //   .collection(this.#COLLECTION)
    //   .deleteOne({ _id: ObjectId.createFromHexString(id) });
    // connection.close();
    // return data;
  }

  // Метод для получения (чтения) списка ВСЕХ пользователей: 
  async getUsers() {
    const users = await User.find({})
    return users;

  //   const connection = await getConnection();
  //   const db = useDefaultDb(connection);
  //   const data = await db.collection(this.#COLLECTION).find({}).toArray();
  //   connection.close();
  //   return data;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по ID: (объект)
  async getUserByID(id) {
    const data = await User
      .findOne({ _id: ObjectId.createFromHexString(id) });
    return data;


    // const connection = await getConnection();
    // const db = useDefaultDb(connection);
    // const data = await db
    //   .collection(this.#COLLECTION)
    //   .findOne({ _id: ObjectId.createFromHexString(id) });
    // connection.close();
    // return data;
  }

    // Метод проверки наличия логина и емейла при регистрации:
    async validateRegistrationData(newEmail, newUserName) {    
      const data = await User
        .findOne({$or:[{email: newEmail}, {username: newUserName}]})   
      return data;   

      // const connection = await getConnection();
      // const db = useDefaultDb(connection);      
      // const data = await db
      //   .collection(this.#COLLECTION)
      //   .findOne({$or:[{email: newEmail}, {username: newUserName}]})
      // connection.close();   
      //return data;
    }

  // Метод для получения данных КОНКРЕТНОГО пользователя по email: (объект)
  async getUserByEmail(email) {
    const data = await User
      .findOne({ email: email });
    return data;
  }
}

module.exports = new UsersServices();
