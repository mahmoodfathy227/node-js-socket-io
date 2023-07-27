const app = require('express');
const express = app();
const http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


const server = http.createServer(express);
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({extended: false}));




var Message = mongoose.model('Message',{
    name : String,
    message : String
  })

  var dbUrl = 'mongodb+srv://mahmoodfathy247:mahmoodfathy2@cluster0.m5bqptp.mongodb.net/?retryWrites=true&w=majority'

express.get('/', (req, res) => {
   res.send("Node Server is running. Yay!!")
});


express.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })

  express.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })



//Socket Logic
const socketio = require('socket.io')(http)

socketio.on('connection', () =>{
    console.log('a user is connected');
    socketio.on('disconnect', () => {
        console.log('user disconnected');
      });


      socketio.on('chat message', (msg) => {
        console.log('message: ' + msg);
        var message = msg;
        message.save((err) =>{
          if(err)
            {sendStatus(500);}
          io.emit('message', msg);
          res.sendStatus(200);
        })


      });
  });


  const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(dbUrl) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
    }

    connectToMongo();
server.listen(3000 , ()=> {
    console.log("connected and live server")
})


