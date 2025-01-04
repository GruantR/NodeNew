class UsersServices {
  #userList = [];  // наша база данных, в данном случае массив объектов

  // Метод добавления новых пользователей
  createUser(data) {
    this.#userList.push(data);
  }

  // Метод для получения списка ВСЕХ пользователей (массив объектов)
  getUsers() {
    return this.#userList;
  }

  // Метод для получения данных КОНКРЕТНОГО пользователся (объект)
  getUserByID(id) {
    const findUser = this.#userList.find((item) => item.id === id);
    return findUser;
  }

  // Метод для получения индекса КОНКРЕТНОГО пользователся в массиве по id (объект со значением индекса)
  getIndexUserByID(id) {
    const findIndex = this.#userList.findIndex((item) => item.id === id);
    return { value: findIndex };
  }
}

module.exports = new UsersServices();
