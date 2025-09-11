const sequelize = require('../config/db');
const Todos = require('./todos.model');
const User = require('./users.molel');

(async () => {
  try {
    await sequelize.sync({ force: true })
    console.log('⚡️ Tables synced')
  } catch (error) {
    console.error('Error syncing tables:', error)
  }
})()

module.exports = { Todos, User }