const express = require("express");
const router = express.Router();
const { body, param, header } = require("express-validator");
const booksControllers = require("../controllers/booksControllers");
//const jwt = require('jsonwebtoken');

const validateParams = [
  param("id")
  .isInt()
  .withMessage("id должно быть в числовом формате")
];
// const validateheaders = [
//   header('Authorization')
//     .customSanitizer(value => {
//       const [type, token] = value.split(' ');
//       if (type !== 'Bearer') {
//         return { value: null, errors: ['111'] };
//       }
//       return { value: token, errors: [] };
//     })
//     .isJWT()
//     .custom((value, { req }) => {
//       const secretKey = 'your_secret_key_here'; // ключ, который вы хотите использовать
//       return jwt.verify(value, secretKey);
//     })
//     .withMessage('Invalid JWT token')
// ]
const validateDataCreateBook = [
  body("bookname")
    .trim() // Убирает пробелы по краям
    .not().isEmpty().withMessage("bookname не должно быть пустым") // Проверка на наличие пустоты
    .isLength({ min: 1 }).withMessage("bookname должно содержать хотя бы 1 символ") // Дополнительная проверка длины
  ,
  body("author").isAlpha().trim(),
  body("pages").isInt().withMessage("Только цифрами вооди"),
];


router.post("/", validateDataCreateBook, booksControllers.createBook);
router.get("/", /*validateheaders,*/booksControllers.getBooks);
router.get("/:id", validateParams, booksControllers.getBookByID);
router.put("/:id", booksControllers.updateBook);
router.delete("/:id", booksControllers.deleteBook);

module.exports = router;
