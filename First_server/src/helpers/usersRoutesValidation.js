const { body } = require("express-validator");
const { param } = require("express-validator");

class UsersRoutesValidation {
  validateDataCreateUser() {
    return [
      body("email").isEmail().withMessage("Email не корректен"),
    ];
  }

  validateDataUpdateUser() {
    return [
      body("username")
        .optional()
        .isAlpha()
        .trim()
        .withMessage("Латиница и только"),
      body("email").optional().isEmail().withMessage("Email не корректен"),
      body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Пароль не может быть короче 6 символов"),
    ];
  }

  validateDataPasswordUpdateUser() {
    return [
      body("password")
        .exists()
        .isLength({ min: 6 })
        .withMessage("Пароль не может быть короче 6 символов"),
    ];
  }
}

module.exports = new UsersRoutesValidation();
