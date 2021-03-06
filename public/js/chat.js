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

messageInput.focus()

// Send Message
function sendMessage(){
  socket.emit('sendMessage', messageInput.value)
  messageInput.value = ''
}

sendBtn.addEventListener('click', () => {
  sendMessage()
})

document.body.addEventListener("keydown", (e) =>{
  if(e.keyCode == 13){
    sendMessage()
  }
}, false);

socket.on('receiveMessage', function(data){
  const p = document.createElement('p')
  const userNameSpan = document.createElement('span')
  const messageSpan = document.createElement('span')
  messageSpan.innerText = data.message
  userNameSpan.innerText = `${data.from}: `
  
  if(data.from == userName){
    userNameSpan.style.color = 'red'
  }
  else{
    userNameSpan.style.color = 'blue'
  }
  p.appendChild(userNameSpan)
  p.appendChild(messageSpan)
  
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
