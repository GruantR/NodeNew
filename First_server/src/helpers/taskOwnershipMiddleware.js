const TodosServices = require("../services/todosServices");

class TaskAccessService {
  // проверка существования таски и ее принадлежности к авторизированному юзеру
  async checkTaskAccess(taskId, userId) {
    // 1. Получаем задачу по ID
    const task = await TodosServices.getTodoById(taskId);

    // 2. Если задача не найдена
    if (!task) {
      const error = new Error("Таска с указанным идентификатором не найдена");
      error.statusCode = 404;
      throw error;
    }

    // 3. Проверяем, принадлежит ли задача пользователю
    if (task.user.toString() !== userId) {
      const error = new Error("Нет доступа к этой задаче");
      error.statusCode = 403;
      throw error;
    }
    return task;
  }
}

module.exports = new TaskAccessService();
