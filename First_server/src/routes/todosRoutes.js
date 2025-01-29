const express = require("express");
const router = express.Router();
module.exports = router
const TodosControllers = require("../controllers/todosControllers");
const TodosRoutesValidation = require("../helpers/todosRoutesValidation")
const authenticateToken = require("../middleware/authenticateToken")
/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Получить список всех СВОИХ тасок
 *     description: бла бла бла...
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ОК - Лови свои таски БРО
 *       401:
 *         description: Unauthorized - Ты не пройдешь, предъяви пропуск
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
 *        200:
 *          description: ОК - Таска успешно создана
 *        400:
 *          description: Bad Request - проверьте вводимые данные
 *        401:
 *         description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *        404:
 *          description: Error - такой пользователь уже существует
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
 *               isCompleted:
 *                 type: boolean
 *                 example: false
 *                 description: Отметка о выполнении
 * 
 * 
 */
router.post("/",authenticateToken,TodosRoutesValidation.validateDataCreateTodos(),TodosControllers.createTodos);
/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Переименовываем название задания по ID этого задания
 *     description: Любое описание...
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
 *         description: Пароль успешно изменён.
 *       401:
 *         description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       404:
 *          description: Таска с указанным идентификатором не найдена.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.patch("/:id", authenticateToken, TodosRoutesValidation.validateDataPatchTodosByTitle(), TodosControllers.patchTitleTodos);
/**
 * @swagger
 * /api/todos/{id}/isCompleted:
 *   patch:
 *     summary: Изменить статус исполнения задания
 *     description: Любое описание...
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
 *         description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       404:
 *          description: Таска с указанным идентификатором не найдена.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.patch("/:id/isCompleted", authenticateToken, TodosControllers.patchIsCompletedTodos);
/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Удаляем задание
 *     description: Любое описание...
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
 *         description: Unauthorized - Ты не пройдешь, предъяви пропуск
 *       404:
 *          description: Таска с указанным идентификатором не найдена.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.delete("/:id",authenticateToken,TodosControllers.deleteTodosByID)