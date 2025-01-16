const { body } = require("express-validator");

class UsersRoutesValidation {
  validateDataCreateUser() {
    return [
      body("username").isAlpha().trim().withMessage("Латиница и только"),
      body("email")
        .isEmail()
        .withMessage("Email не корректен"),
      body("password")
      .isLength({ min: 6 })
      .withMessage('Пароль не может быть короче 6 символов'),
    ];
  }
}

module.exports = new UsersRoutesValidation();
