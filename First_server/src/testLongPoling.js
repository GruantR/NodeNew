// server.js
const express = require('express');
const app = express();
const port = 3000;
const path = require("path");

let messages = [];

// Раздача статических файлов (будем создавать в public)
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public', 'publicLongPolling')));


// API для получения сообщений
app.get('/messages', (req, res) => {
  // Если нет сообщений, ждем 5 секунд (имитация long polling)
  if (messages.length === 0) {
    const timeoutId = setTimeout(() => {
      res.json(messages);
    }, 5000); // 5 секунд ожидания

    // Удаляем таймаут, если "сообщения" были получены
    const checkMessages = setInterval(() => {
      if (messages.length > 0) {
        clearTimeout(timeoutId);
        clearInterval(checkMessages);
        res.json(messages);
      }
    }, 1000); // Проверяем каждую секунду
  } else {
    // Если есть сообщения, сразу их отправляем
    res.json(messages);
  }
});

// API для отправки сообщений
app.post('/messages', express.json(), (req, res) => {
  messages.push(req.body.message);
  res.status(200).send();
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});


// 1. Создать базу данных с именем `“firstExperience”`
// НУ ТИПА DONE

// 2. Создай таблицу `"Employees"` с полями:
// 		- **id** (целое число, автоинкрементируемый)
// 		- **name** (строка)
// 		- **age** (целое число)
// 		- **salary** (число).
// --------------------------------------
// CREATE TABLE employees (
// id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT 1) NOT NULL,
// name varchar (32),
// age smallint,
// salary integer
// )

// 3. Вставь 5 записей в таблицу `"Employees"`.
// --------------------------------------
// INSERT INTO employees (name, age, salary)
// VALUES 
// ('Pavel', 23, 40000),
// ('Viktor', 30, 60000),
// ('Elena', 18, 17000),
// ('Patoshik', 44, 78000),
// ('Denis', 67, 99000)

// 4. Выбери всех сотрудников старше 30 лет.
// --------------------------------------
// SELECT *
// FROM employees
// WHERE age > 30

// 5. Выбери имена всех сотрудников, у которых зарплата выше 50000.
// --------------------------------------
// SELECT *
// FROM employees
// WHERE salary > 50000

// 6. Выбери всех сотрудников, чья зарплата находится в диапазоне от 40000 до 60000.
// --------------------------------------
// SELECT *
// FROM employees
// WHERE salary BETWEEN 40000 AND 60000

// 7. Обнови зарплату для сотрудника с именем "Pavel" на 60000.
// --------------------------------------
// UPDATE employees
// SET salary = 60000
// WHERE name = 'Paver'

// 8. Удали всех сотрудников младше 25 лет.
// --------------------------------------
// DELETE
// FROM employees
// WHERE age < 25

// 9. Создай новую таблицу `"Departments"` с полями: 
// 		- **id** (целое число, автоинкрементируемый)
// 		- **name** (строка).
// --------------------------------------
// CREATE TABLE departaments (
// id integer GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT 1) NOT NULL,
// name varchar (32) 
// )

// 10. Добавь поле **"managerId"** в таблицу `"Departments"`, которое будет являться внешним ключом, ссылаясь на идентификатор руководителя отдела в таблице `"Employees"`.
// --------------------------------------
// ALTER TABLE employees
// ADD CONSTRAINT pk_employees_id PRIMARY KEY (id);

// ALTER TABLE departaments
// ADD COLUMN managerId integer,
// ADD CONSTRAINT fk_departments_emp_manager FOREIGN KEY (managerId) REFERENCES employees (id);

// 11. Вставь 2-3 записи в таблицу `"Departments"` и назначь менеджера в департамент.
// --------------------------------------
// INSERT INTO departaments (name,managerId)
// VALUES 
// ('Accounting',5),
// ('Marketing', 4);

// SELECT *
// FROM departaments

// TRUNCATE TABLE departaments

// 12. Обнови поле `departmentId` для всех сотрудников, чтобы указать соответствующий отдел.
// --------------------------------------
// ALTER TABLE employees
// ADD COLUMN departmentId integer 

// UPDATE employees
// SET departmentId = departaments.id
// FROM departaments
// WHERE employees.id = departaments.managerId

// 13. Выбери имена всех сотрудников и названия отделов, в которых они работают.
// 14. Подсчитай общее количество сотрудников в таблице "Employees".
// 15. Найди среднюю зарплату всех сотрудников.
// 16. Выбери всех сотрудников, имена которых начинаются с буквы "A".
// 17. Удали всех сотрудников, у которых зарплата ниже 30000 и возраст больше 40 лет.
// 18. Создай индекс на поле **"name"** в таблице `"Employees"`.
// 19. Выбери всех сотрудников, отсортированных по возрастанию зарплаты.
// 20. Найди максимальную зарплату среди всех сотрудников. Выведи имя и департамент сотрудника.
// 21. Обнови возраст сотрудника с именем "Pavel" на 35 лет.
// 22. Создай новую таблицу `"Projects"` с полями: 
// 		- **id** (целое число, автоинкрементируемый)
// 		- **name** (строка)
// 		- **employeeId** (целое число, внешний ключ, связанный с id сотрудника).
