const express = require("express");
const router = express.Router();
const booksControllers = require("../controllers/booksControllers");

router.post("/", booksControllers.createBook);
router.get("/", booksControllers.getBooks);
router.get("/:id", booksControllers.getBookByID);
router.put("/:id", booksControllers.updateBook);
router.delete("/:id", booksControllers.deleteBook);

module.exports = router;
