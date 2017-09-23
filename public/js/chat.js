const messageInput = document.getElementById('messageInput')
const sendBtn = document.getElementById('sendBtn')
const chatLog = document.getElementById('chatLog')

const socket = io();
socket.emit('setUsername', userName)

sendBtn.addEventListener('click', () => {
  socket.emit('sendMessage', messageInput.value)
})

socket.on('receiveMessage', function(message){
  const p = document.createElement('p')
  p.innerText = message
  chatLog.appendChild(p)
})