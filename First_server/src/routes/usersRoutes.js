const express = require("express");
const router = express.Router();
const UsersControllers = require("../controllers/usersControllers");
const UsersRoutesValidation = require("./usersRoutesValidation")
const authenticateToken = require("../middleware/authenticateToken")

router.post("/register", UsersRoutesValidation.validateDataCreateUser(),UsersControllers.createUsers);
router.post("/login" ,UsersControllers.loginUser);
router.get("/",authenticateToken, UsersControllers.getUsers);
router.get("/:id", UsersControllers.getUserByID);
router.put("/:id", UsersControllers.updateUserData);
router.patch("/:id", UsersControllers.updateUserPassword);
router.delete("/:id", UsersControllers.deleteUser);

module.exports = router;
