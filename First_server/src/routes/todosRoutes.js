const express = require("express");
const router = express.Router();
module.exports = router
const TodosControllers = require("../controllers/todosControllers");
const TodosRoutesValidation = require("../helpers/todosRoutesValidation")
const authenticateToken = require("../middleware/authenticateToken");
const todosRoutesValidation = require("../helpers/todosRoutesValidation");
const handleValidationErrors = require('../middleware/validationMiddleware');
/**
 * @swagger
 * /api/todos/all:
 *   get:
 *     summary: Получить таски всех пользвателей
 *     description: Свободный доступ ко всем задачам
 *     tags:
 *       - Todos
 *     responses:
 *       200:
 *         description: ОК - Лови свои таски БРО
 *       500:
 *         description: Internal Server Error - Сервер ушёл не попрощавшись. Пожалуйста, попробуйте повторить запрос позже, он вернётся.
 */
router.get("/all", TodosControllers.getTodos);
/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Получить список СВОИХ тасок
 *     description: Только свои таски
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ОК - Лови свои таски БРО
 *       401:
 *         description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       403:
 *         description: Forbidden - Токен не корректен
 *       500:
 *         description: Internal Server Error - Сервер ушёл не попрощавшись. Пожалуйста, попробуйте повторить запрос позже, он вернётся.
 */
router.get("/",authenticateToken, TodosControllers.getTodosSpecificUser);
/**
 * @swagger
 * /api/todos:
 *    post:
 *      summary: Создание тасок
 *      description: Любое описание...
 *      tags:
 *        - Todos
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/TodosRegisterAndEdit"
 *      responses:
 *        201:
 *          description: ОК - Таска успешно создана
 *        400:
 *          description: Bad Request - проверьте вводимые данные
 *        401:
 *          description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *        403:
 *          description: Forbidden - Токен не корректен
 *        404:
 *          description: Error - Такая таска уже существует (ЭТОТ ФИЛЬТР ПРОСИТСЯ НО ПОКА НЕ НАПИСАН)
 *        500:
 *          description: Internal Server Error - Сервер ушёл не попрощавшись. Пожалуйста, попробуйте повторить запрос позже, он вернётся.
 * 
 * components:
 *   requestBodies:
 * 
 *     TodosRegisterAndEdit:
 *       description: UserRegisterAndPut - шаблон-схема для создания и редактирования.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: goToSleep
 *                 description: Название-заголовок
 * 
 * 
 */
router.post("/",authenticateToken,TodosRoutesValidation.validateDataCreateTodos(),TodosControllers.createTodos);
/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Изменить задачу (переименовать её)
 *     description: Введите новое название своей задачи
 *     tags:
 *        - Todos 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *         description: Идентификатор таски.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Название задания изменено успещно.
 *       401:
 *          description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       403:
 *          description: Forbidden - Токен не корректен
 *       404:
 *          description: Таска с указанным идентификатором не найдена.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.patch("/:id", authenticateToken, TodosRoutesValidation.validateDataPatchTodosByTitle(), todosRoutesValidation.validateIdParam(), handleValidationErrors, TodosControllers.patchTitleTodos);
/**
 * @swagger
 * /api/todos/{id}/isCompleted:
 *   patch:
 *     summary: Изменить статус исполнения задания
 *     description: Жмятки и статус изменится
 *     tags:
 *        - Todos 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *         description: Идентификатор таски.
 *     responses:
 *       200:
 *         description: Статус исполнения успешно изменён.
 *       401:
 *          description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       403:
 *          description: Forbidden - Токен не корректен
 *       404:
 *          description: Таска с указанным идентификатором не найдена.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.patch("/:id/isCompleted", authenticateToken, todosRoutesValidation.validateIdParam(), handleValidationErrors, TodosControllers.patchIsCompletedTodos);
/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Удаляем задание
 *     description: Скажи пока заданию
 *     tags:
 *        - Todos 
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *         description: Идентификатор таски.
 *     responses:
 *       200:
 *         description: Задача успешно удалена
 *       401:
 *          description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       403:
 *          description: Forbidden - Токен не корректен
 *       404:
 *          description: Таска с указанным идентификатором не найдена.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.delete("/:id",authenticateToken, todosRoutesValidation.validateIdParam(), handleValidationErrors, TodosControllers.deleteTodosByID)