const express = require("express");
const router = express.Router();
const UsersControllers = require("../controllers/usersControllers");
const UsersRoutesValidation = require("../helpers/usersRoutesValidation")
const authenticateToken = require("../middleware/authenticateToken")



/**
 * @swagger
 * /api/users/register:
 *    post:
 *      summary: Регистрация пользователя
 *      description: Любое описание...
 *      tags:
 *        - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/UserRegisterAndPut"
 *      responses:
 *        200:
 *          description: ОК - Таска успешно создана
 *        400:
 *          description: Bad Request - проверьте вводимые данные
 *        404:
 *          description: Error - такой пользователь уже существует
 *        500:
 *          description: Internal Server Error - Сервер ушёл не попрощавшись. Пожалуйста, попробуйте повторить запрос позже, он вернётся.
 * 
 * components:
 *   requestBodies:
 * 
 *     UserRegisterAndPut:
 *       description: UserRegisterAndPut - шаблон-схема для регистрации и редактирования.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *                 description: Имя пользователя
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *                 description: Почта пользователя
 *               password:
 *                 type: string
 *                 example: 123123
 *                 description: Пароль пользователя
 * 
 *     UserLogin:
 *       description: Шаблон-схема для логирования
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *                 description: Почта пользователя
 *               password:
 *                 type: string
 *                 example: 123123
 *                 description: Пароль пользователя
 * 
 * 
 */
router.post("/register", UsersRoutesValidation.validateDataCreateUser(),UsersControllers.createUsers);

/**
 * @swagger
 * /api/users/login:
 *    post:
 *      summary: Логирование пользователя
 *      description: Любое описание...
 *      tags:
 *        - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/UserLogin"
 *      responses:
 *        200:
 *          description: ОК - Пользователь успешно авторизован
 *        401:
 *          description: Unauthorized - Неверный логин или пароль
 *        500:
 *          description: Internal Server Error - Сервер ушёл не попрощавшись. Пожалуйста, попробуйте повторить запрос позже, он вернётся.
 * 
 */
router.post("/login" ,UsersControllers.loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     description: Получение списка всех пользователей (только для Авторизорованных)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ОК - Лови бро массив объектов пользователей из БД
 *       500:
 *         description: Internal Server Error - Сервер ушёл не попрощавшись. Пожалуйста, попробуйте повторить запрос позже, он вернётся.
 */
router.get("/",authenticateToken, UsersControllers.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *    get:
 *      summary: Получение сведений о пользователе по id
 *      description: Любое описание...
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *      responses:
 *        200:
 *          description: Пользватель найден
 *        404:
 *          description: Пользователь с указанным идентификатором не найден.
 *        500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.get("/:id", UsersControllers.getUserByID);
/**
 * @swagger
 * /api/users/{id}:
 *    put:
 *      summary: Редактирование данных пользователя по id
 *      description: Любое описание...
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *      requestBody:
 *        $ref: "#/components/requestBodies/UserRegisterAndPut"
 *      responses:
 *        201:
 *          description: Успешное обновление таски
 *        400:
 *          description: Некорректный запрос. Проверьте, пожалуйста Ваши исходные данные.
 *        404:
 *          description: Пользователь с указанным идентификатором не найден.
 *        500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.put("/:id", UsersControllers.updateUserData);
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляем пароль пользователя по его ID
 *     description: Любое описание...
 *     tags:
 *        - Users 
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пароль успешно изменён.
 *       404:
 *          description: Польователь с указанным идентификатором не найден.
 *       500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.patch("/:id", UsersControllers.updateUserPassword);
/**
 * @swagger
 * /api/users/{id}:
 *    delete:
 *      summary: Удаление пользователя по id
 *      description: Любое описание...
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *      responses:
 *        200:
 *          description: Успешное удаление пользователя
 *        404:
 *          description: Пользователь с указанным идентификатором не найден.
 *        500:
 *          description: Внутренняя ошибка сервера. Пожалуйста, попробуйте повторить запрос позже.
 */
router.delete("/:id", UsersControllers.deleteUser);

module.exports = router;
