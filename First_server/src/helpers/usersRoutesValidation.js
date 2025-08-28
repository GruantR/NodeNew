const { body } = require("express-validator");
const { param } = require('express-validator');
const { ObjectId } = require('mongodb');

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
  };

  validateDataUpdateUser() {
    return [
      body("username")
        .optional()
        .isAlpha()
        .trim()
        .withMessage("Латиница и только"),
      body("email")
        .optional()
        .isEmail()
        .withMessage("Email не корректен"),
      body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage('Пароль не может быть короче 6 символов'),
    ];
  };

  validateIdParam() {
return [
  param("id").isLength({ min: 24, max: 24 })
  .withMessage('ID должен содержать ровно 24 символа')
  .isHexadecimal()
  .withMessage('ID должен содержать только шестнадцатеричные символы (0-9, a-f)')
  .custom((value) => {
    if (!ObjectId.isValid(value)) {
      throw new Error('Неверный формат ID');
    }
    return true;
  })
];
  };
 

}

module.exports = new UsersRoutesValidation();
