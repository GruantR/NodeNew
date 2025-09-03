const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Schema, model } = mongoose;

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
const TodosModel = model('Todo', todosSchema); // имя указанное переходит в нижний регистр и создает коллекцию

module.exports = TodosModel;