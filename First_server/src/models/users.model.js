//users.model.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальное ограничение
    validate: {
      isAlpha: {
        msg: "Имя пользователя должно содержать только латинские буквы"
      },
      notEmpty: {
        msg: "Имя пользователя не может быть пустым"
      },
      len: {
        args: [3, 30],
        msg: "Имя пользователя должно быть от 3 до 30 символов"
      }
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: "Возраст должен быть целым числом"
      },
      min: {
        args: [0],
        msg: "Возраст не может быть отрицательным"
      },
      max: {
        args: [150],
        msg: "Возраст не может быть больше 150"
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Некорректный формат email"
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: "Пароль должен быть не короче 6 символов"
      }
    }
  }
});

module.exports = User