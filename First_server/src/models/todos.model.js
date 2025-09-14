//todos.model.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'inProgress', 'completed'),
    defaultValue: 'pending'
  },
  userID: {
    type: DataTypes.INTEGER,
  }
});

module.exports = Todo