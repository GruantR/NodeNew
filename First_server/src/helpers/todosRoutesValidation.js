const { body } = require("express-validator");
const { param } = require('express-validator');
const { ObjectId } = require('mongodb');

class UsersRoutesValidation {
  validateDataCreateTodos() {
    return [
      body("title")
        .trim() // Убирает пробелы по краям
        .not()
        .isEmpty()
        .withMessage("Заголовок не должно быть пустым") // Проверка на наличие пустоты
        .isLength({ min: 1 })
        .withMessage("Заголовок хочкт быть длинее чем пустота"),
      //body("isCompleted").isBoolean().withMessage("Только логические значения"),
    ];
  }
  validateDataPatchTodosByTitle() {
    return [
      body("title")
        .trim() // Убирает пробелы по краям
        .not()
        .isEmpty()
        .withMessage("Заголовок не должно быть пустым") // Проверка на наличие пустоты
        .isLength({ min: 1 })
        .withMessage("Заголовок хочкт быть длинее чем пустота"),
    ];
  }

  validateIdParam() {
    return [
      param("id")
        .isLength({ min: 24, max: 24 })
        .withMessage("ID должен содержать ровно 24 символа")
        .isHexadecimal()
        .withMessage(
          "ID должен содержать только шестнадцатеричные символы (0-9, a-f)"
        )
        .custom((value) => {
          if (!ObjectId.isValid(value)) {
            throw new Error("Неверный формат ID");
          }
          return true;
        }),
    ];
  }
}

module.exports = new UsersRoutesValidation();
