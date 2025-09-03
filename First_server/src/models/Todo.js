const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Schema, model } = mongoose;
const User = require("./User"); // Импортируем модель User

const todosSchema = new Schema({
    title: String,
user: {
   type: Schema.Types.ObjectId,
   ref: 'User' // Ссылаемся на модель 'User'
},
    completed: Boolean,
    createdAt: Date,
    updatedAt: Date
});

//Создание модели
const TodosModel = model('Todo', todosSchema);

module.exports = TodosModel;