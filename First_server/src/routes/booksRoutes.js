const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const booksControllers = require("../controllers/booksControllers");

const validateParams = [param("id").isInt()];

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
router.get("/", booksControllers.getBooks);
router.get("/:id",validateParams, booksControllers.getBookByID);
router.put("/:id", booksControllers.updateBook);
router.delete("/:id", booksControllers.deleteBook);

module.exports = router;
