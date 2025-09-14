const { Op } = require('sequelize');
const {User} = require('../models/models');



class UsersServices {
  #COLLECTION = "users";

  // Метод добавления (записи) новых пользователей:
  async createUser(info) {
    const newUser = await User.create(info);
    return newUser;
  }
 
  // Метод обновления данных пользователей:
  async updateData(id, updateData) {
    const data = await User.update(updateData,{where: {id:id}});
    return data;
  }

  // Метод удаления пользователей из базы по id:
  async deleteData(id) {
    const data = await User.destroy({where: {id:id}});
    return data;
  }

  // Метод для получения (чтения) списка ВСЕХ пользователей:
  async getUsers() {
    const users = await User.findAll({});
    return users;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по ID: (объект)
  async getUserByID(id) {
    const data = await User.findByPk(id);
    return data;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователя по email: (объект)
  async getUserByEmail(email) {
    const data = await User.findOne({
      where: { email: email }});    
    return data;
  }
}

module.exports = new UsersServices();
