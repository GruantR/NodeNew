const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

// Middleware для Логирования 
function logger(req, res, next) {
    console.log(`Запрос на ${req.url}`);
    next();
}
app.use(logger);

//  Создать маршрут для обработки HTTP GET-запроса по пути **`/api/hello`**, который возвращает простое сообщение `"Привет, Redev!"`.
app.get('/api/hello', (req,res)=>{
res.send("Привет, Redev!")
});

// Создать маршрут для обработки HTTP POST-запроса по пути /api/echo, который принимает JSON-объект с ключом "message" в теле запроса и возвращает этот текст как ответ.
app.post('/api/echo', (req,res)=>{
    res.send(req.body.message);
})



// Создание (Create)
// {
//     "id":"1",
//     "username": "Masha",
//     "email":"ruslanusrulit@gmail.com",
//     "password":"Qwe123"
// }
let userList = [];
class Users {
    constructor(id,username,email,password) {
        this.id = id;
        this.username=username;
        this.email=email;
        this.password=password;
    }
}
app.post('/api/users', (req,res)=>{
    const {id,username,email,password} = req.body
let user = new Users(id, username, email,password);
userList.push(user)
res.send(`Пользователь ${user.username} успешно создан`);
})


// Получение списка всех пользователей
app.get('/api/users/', (req,res)=>{
    //res.send(`Список всех пользователей: ${JSON.stringify(userList)}`);
    res.json(userList)
})

// Получение информации о конкретном пользователе
app.get('/api/users/:id', (req,res)=>{
 const targetId = req.params.id
 const findUser = userList.find(item => item.id === targetId)
 if (findUser) {
    res.json(findUser)
 }
 else {
    res.status(404).send('Пользователь не найден')
 }
})



//Изменение конкретного пользователя
app.put('/api/users/:id', (req,res)=>{
    const targetId = req.params.id;
    const findUser = userList.find(item => item.id === targetId);
    if (findUser) {
        const {username,email,password} = req.body
        findUser.username = username;
        findUser.email = email;
        findUser.password = password;
        res.send(`Данные пользоователя зарегистрированного под id:${findUser.id} обновлены`)
     }
     else {
        res.status(404).send('Пользователь не найден')
     }

});


//Изменение пароля конкретного пользователя
app.patch('/api/users/:id', (req,res)=>{
    const targetId = req.params.id;
    const findUser = userList.find(item => item.id === targetId);
    if (findUser) {
        const {password} = req.body
        findUser.password = password;
        res.send(`Пароль пользоователя ${findUser.username} зарегистрированного под id:${findUser.id} обновлён!`)
     }
     else {
        res.status(404).send('Пользователь не найден')
     }

});


// Удаление конкретного пользователя
app.delete('/api/users/:id', (req,res)=>{
const targetId = req.params.id;
const findIndex = userList.findIndex(item=> item.id === targetId);

if (findIndex >= 0) {
    userList.splice(findIndex,1)
    res.send(`Пользователь удалён!`)
    res.json(userList)
}
else {
    res.status(404).send('Пользователь не найден')
}

})






const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Запущен сервер на http://localhost:${PORT}`);
    
})