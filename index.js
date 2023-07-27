const app = require('express');
const express = app();
const http = require('http');
const server = http.createServer(express);

express.get('/', (req, res) => {
   res.send("Node Server is running. Yay!!")
});

//Socket Logic
const socketio = require('socket.io')(http)

socketio.on("connection", (userSocket) => {
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
    })
});

server.listen(process.env.PORT)


