
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    isAlpha: true
  },
  age: {
    type: DataTypes.INTEGER,
    isNumeric: true
  },
  email: {
    type: DataTypes.STRING,
    isEmail: true,
    unique: true
  },
  password: {
     type: DataTypes.STRING
  }
});

module.exports = User