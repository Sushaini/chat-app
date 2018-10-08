var socate = io()

function scrolltoBottom() {
  // Selectors
  var messages = $('#messages')
  var newMessage = messages.children('li:last-child')
  // Hieghts
  const clientHeight = messages.prop('clientHeight')
  const scrollTop = messages.prop('scrollTop')
  const scrollHeight = messages.prop('scrollHeight')
  const newMessageHeight = newMessage.innerHeight()
  const lastMessageHeight = newMessage.prev().innerHeight()

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight)
  }
}

socate.on('connect', () => {
  const params = $.deparam(window.location.search)

  socate.emit('join', params, err => {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      console.log('no errors')
    }
  })
})

socate.on('newMsg', msg => {
  // console.log('New Msg', msg)
  // const formatedTime = moment(msg.createdAt).format('hh:mm a')
  // let ls = $('<li></li>')
  // ls.text(`${msg.from} : ${msg.text} ${formatedTime}`)

  // $('#messages').append(ls)
  const formatedTime = moment(msg.createdAt).format('hh:mm a')
  const template = $('#message-template').html()
  const html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formatedTime
  })

  $('#messages').append(html)
  scrolltoBottom()

})

socate.on('disconnect', () => {
  console.log('Disconnected from server')
})

socate.on('updateUsersList', (users) => {
  var ol = $('<ol></ol>')

  users.forEach(user => {
    ol.append($('<li></li>').text(user))
  });

  $('#users').html(ol)
})

$('#message-form').on('submit', event => {
  event.preventDefault()

  const messageTextBox = $('[name=message]')

  socate.emit(
    'createMsg', {
      from: 'user',
      text: messageTextBox.val()
    },
    () => {
      messageTextBox.val('')
    }
  )
})

var locationButton = $('#send-location')
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    alert('Geo location is not supported by your browser')
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...')

  function position(position) {
    locationButton.removeAttr('disabled').text('Send location')
    socate.emit('createLocationMsg', {
      lat: position.coords.latitude,
      long: position.coords.longitude
    })
  }

  function errors(error) {
    locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch the location')
  }
  navigator.geolocation.getCurrentPosition(position, errors)
})

socate.on('newLocationMsg', msg => {
  const formatedTime = moment(msg.createdAt).format('hh:mm a')
  const template = $('location-message-template').html()
  const html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formatedTime
  })

  $('#messages').append(html)
  scrolltoBottom()
  // const ls = $('<li></li>')
  // const a = $('<a target="_blank">My Current Location</a>')
  // const formatedTime = moment(msg.createdAt).format('hh:mm a')

  // ls.text(`${msg.from} ${formatedTime} : `)
  // a.attr('href', msg.url)
  // ls.append(a)

  // $('#messages').append(ls)
})