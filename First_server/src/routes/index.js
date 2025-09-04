const express = require("express");
const usersRoutes = require("./usersRoutes");
const todosRoutes = require("./todosRoutes");
const router = express.Router();

router.use("/users", usersRoutes);
router.use("/todos", todosRoutes);
module.exports = router;
