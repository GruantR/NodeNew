const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: String,
    age: Number,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
});

//Создание модели
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;