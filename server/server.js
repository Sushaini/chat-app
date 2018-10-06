const express = require('express')
const socateIO = require('socket.io')
const http = require('http')
const path = require('path')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socateIO(server)

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages')

app.use(express.static(publicPath))

io.on('connection', socate => {
  console.log('User connected')

  socate.emit('newMsg', generateMessage('Admin', 'Welcome to the chat app'))

  socate.broadcast.emit(
    'newMsg',
    generateMessage('Admin', 'New user is joined')
  )

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

  socate.on('join', (params, callback) => {

  })

  socate.on('disconnect', () => {
    console.log('User was disconnected')
  })
})

server.listen(port, () => {
  console.log(`server up on ${port}`)
})