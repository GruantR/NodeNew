const express = require("express");
const router = express.Router();
module.exports = router
const TodosControllers = require("../controllers/todosControllers");
const TodosRoutesValidation = require("./todosRoutesValidation")
const authenticateToken = require("../middleware/authenticateToken")
router.get("/",authenticateToken, TodosControllers.getTodosSpecificUser);
router.post("/",authenticateToken,TodosRoutesValidation.validateDataCreateTodos(),TodosControllers.createTodos)
router.patch("/:id", authenticateToken, TodosRoutesValidation.validateDataPatchTodosByTitle(), TodosControllers.patchTitleTodos)