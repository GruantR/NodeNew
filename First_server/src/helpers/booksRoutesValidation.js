const { param, body } = require("express-validator");

class BooksRoutesValidation {
  validateParamsId() {
    return [
      param("id").isInt().withMessage("id должно быть в числовом формате"),
    ];
  }
  validateDataCreateBook() {
    return [
      body("bookname")
        .trim() // Убирает пробелы по краям
        .not().isEmpty().withMessage("bookname не должно быть пустым") // Проверка на наличие пустоты
        .isLength({ min: 1 }).withMessage("bookname должно содержать хотя бы 1 символ") // Дополнительная проверка длины
      ,
      body("author").isAlpha().trim(),
      body("pages").isInt().withMessage("Только цифрами вооди"),
    ];
  }
}

module.exports = new BooksRoutesValidation();
