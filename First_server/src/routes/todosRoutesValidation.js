const { body } = require("express-validator");

class UsersRoutesValidation {
  validateDataCreateTodos() {
    return [
      body("title")
      .trim() // Убирает пробелы по краям
      .not().isEmpty().withMessage("Заголовок не должно быть пустым") // Проверка на наличие пустоты
      .isLength({ min: 1 }).withMessage("Заголовок хочкт быть длинее чем пустота"),
      body("isCompleted")
    .isBoolean()
    .withMessage("Только логические значения")

    ];
  }
}

module.exports = new UsersRoutesValidation();
