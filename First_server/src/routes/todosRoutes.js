const express = require("express");
const router = express.Router();
module.exports = router
const TodosControllers = require("../controllers/todosControllers");
const TodosRoutesValidation = require("./todosRoutesValidation")
const authenticateToken = require("../middleware/authenticateToken")
router.get("/",authenticateToken, TodosControllers.getTodos);
router.post("/",authenticateToken,TodosRoutesValidation.validateDataCreateTodos(),TodosControllers.createTodos)