const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const path = require('path')
const filter = require('bad-words')

const pathDirectory = path.join(__dirname, '../public')


const server = http.createServer(app)

const io = socketio(server)

app.use(express.static(pathDirectory))
io.on('connection', (socket) => {
    console.log('New websocket connection')
    socket.emit('connection', 'WELCOME')
    socket.broadcast.emit('msg', 'A new has Arrived!')
    socket.on('msg', (msg, callback) => {
        const bad = new filter()
        if (bad.isProfane(msg)) {
            return callback('Word is disguiting')
        }
        io.emit('msg', msg)
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('msg', 'A user has left')
    })
    socket.on('location', (lat, long, callback) => {
        socket.broadcast.emit('location', 'https://www.google.com/maps?q=' + lat + ',' + long)
        console.log(lat, long)
        callback()

    })
})

server.listen(3000, () => {
    console.log("Server started")
})