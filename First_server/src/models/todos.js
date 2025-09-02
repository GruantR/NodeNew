const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Schema, model } = mongoose;

const todosSchema = new Schema({
    title: String,
});

//Создание модели
const TodosModel = mongoose.model('todos', todosSchema);

module.exports = TodosModel;