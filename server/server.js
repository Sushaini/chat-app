const express = require('express')
const socateIO = require('socket.io')
const http = require('http')
const path = require('path')

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages')

const {
  isRealString
} = require('./utils/validate')

const {
  Users
} = require('./utils/users')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socateIO(server)


app.use(express.static(publicPath))
var users = new Users()

io.on('connection', socate => {
  console.log('User connected')

  socate.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('name and room name is required')
    }

    socate.join(params.room)
    users.removeUser(socate.id)
    users.addUser(socate.id, params.name, params.room)

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room))

    socate.emit('newMsg', generateMessage('Admin', `Welcome to the chat app ${params.name}`))

    socate.broadcast.to(params.room).emit(
      'newMsg',
      generateMessage('Admin', `${params.name} is joined`)
    )
    callback()
  })

  socate.on('createMsg', (msg, callback) => {
    console.log('New Msg', msg)
    io.emit('newMsg', generateMessage(msg.from, msg.text))
    callback()
  })

  socate.on('createLocationMsg', location => {
    io.emit(
      'newLocationMsg',
      generateLocationMessage('Admin', location.lat, location.long)
    )
  })

  socate.on('disconnect', () => {
    var user = users.removeUser(socate.id)

    if (user) {
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
      io.to(user.room).emit('newMsg', generateMessage('Admin', `${user.name} has left`))
    }
  })
})

server.listen(port, () => {
  console.log(`server up on ${port}`)
})