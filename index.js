const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser')

if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))


app.get('/', function (req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
  res.render('chat', {username: req.body.username})
});

const allClients = {
}

io.on('connection', function(socket){

  
  allClients[socket.id] = {}

  function handleUserListUpdate(allClients) {
    const userNameList = [];
    Object.keys(allClients).map((key,i) => {
      userNameList.push(allClients[key].username);
    });
    io.sockets.emit('updateUserList', userNameList);
  }

  socket.on('setUsername', function(username){
    allClients[socket.id]['username'] = username
    handleUserListUpdate(allClients)
  });

  socket.on('disconnect', function () {
    delete allClients[socket.id]
    handleUserListUpdate(allClients)
  })

  socket.on('sendMessage', function (message) {
    const from = allClients[socket.id]['username']
    
    console.log(`${from}: ${message}`)
    io.sockets.emit('receiveMessage', {
      from,
      message
    });
    
  })
});



const PORT = process.env.PORT || 3000
http.listen(PORT, function () {
  console.log(`Example app listening on: http://127.0.0.1:${PORT}!`);
});