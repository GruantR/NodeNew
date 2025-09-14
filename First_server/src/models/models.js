//models.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Todo = require('./todos.model');
const User = require('./users.model');

    User.hasMany (Todo, {
        foreignKey: 'userID'
    });
    Todo.belongsTo(User, {
        foreignKey: 'userID'
    });


(async () => {
  try {
    await sequelize.sync({ force: true, logging: false })
    console.log('⚡️ Tables synced')
  } catch (error) {
    console.error('Error syncing tables:', error)
  }
})()

module.exports = { Todo, User }