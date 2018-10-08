// Class User
// getUser(id) return user by id
// addUser(id, name, room) add user and return that user
// removeUser(id) remove the user by id and return

class Users {
  constructor() {
    this.users = []
  }

  addUser(id, name, room) {
    var user = {
      id,
      name,
      room
    }

    this.users.push(user)
    return user
  }

  removeUser(id) {
    // return user that was removed
    var user = this.getUser(id)

    if (user) {
      this.users = this.users.filter(user => user.id !== id)
    }

    return user
  }

  getUser(id) {
    // return the user by the id
    return this.users.filter(user => user.id === id)[0]
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room)
    var namesArray = users.map((user) => user.name)

    return namesArray
  }
}

module.exports = {
  Users
}