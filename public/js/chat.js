const messageInput = document.getElementById('messageInput')
const sendBtn = document.getElementById('sendBtn')
const chatLog = document.getElementById('chatLog')
const userList = document.getElementById('userList')

const addLi = (parent, innerHTML) => {
  const li = document.createElement('li');
  li.innerText = innerHTML;
  parent.appendChild(li);
}

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

socket.on('updateUserList', function(allClients){
  // Clean all users (li) from the user list (ul)
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  }
  
  console.log('Amount of users connected: ' + Object.keys(allClients).length);
  
  // Render all usernames (li) again
  allClients.map(username => addLi(userList, username))
})