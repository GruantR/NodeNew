const express = require("express");
const router = express.Router();
const UsersControllers = require("../controllers/usersControllers");

router.post("/", UsersControllers.createUsers);
router.get("/", UsersControllers.getUsers);
router.get("/:id", UsersControllers.getUserByID);
router.put("/:id", UsersControllers.updateUserData);
router.patch("/:id", UsersControllers.updateUserPassword);
router.delete("/:id", UsersControllers.deleteUser);

module.exports = router;
