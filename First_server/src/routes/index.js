const express = require("express");
const usersRoutes = require("./usersRoutes");
const booksRoutes = require("./booksRoutes");
const todosRoutes = require("./todosRoutes")
const router = express.Router();

router.use("/users", usersRoutes);
router.use("/books", booksRoutes);
router.use("/todos", todosRoutes)
module.exports = router;
