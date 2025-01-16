const express = require("express");
const router = express.Router();
const { body, param, header } = require("express-validator");
const booksControllers = require("../controllers/booksControllers");
const booksRoutesValidation = require('./booksRoutesValidation')

const validateDataCreateBook = [
  body("bookname")
    .trim() // Убирает пробелы по краям
    .not().isEmpty().withMessage("bookname не должно быть пустым") // Проверка на наличие пустоты
    .isLength({ min: 1 }).withMessage("bookname должно содержать хотя бы 1 символ") // Дополнительная проверка длины
  ,
  body("author").isAlpha().trim(),
  body("pages").isInt().withMessage("Только цифрами вооди"),
];


router.post("/", booksRoutesValidation.validateDataCreateBook(), booksControllers.createBook);
router.get("/", booksControllers.getBooks);
router.get("/:id", booksRoutesValidation.validateParamsId(), booksControllers.getBookByID);
router.put("/:id", booksControllers.updateBook);
router.delete("/:id", booksControllers.deleteBook);

module.exports = router;
