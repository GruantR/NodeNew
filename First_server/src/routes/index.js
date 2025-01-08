const express = require("express");
const usersRoutes = require("./usersRoutes");
const booksRoutes = require("./booksRoutes");
const router = express.Router();

router.use("/users", usersRoutes);
router.use("/books", booksRoutes);
module.exports = router;
