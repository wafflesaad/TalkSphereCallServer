const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const {v4: uuidv4} = require('uuid') 

const app = express()
const server = http.createServer(app)

// Configure CORS
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:8081", "http://localhost:8082"],
  methods: ['GET', 'POST'],
  credentials: true
}))

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8082',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId} `)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

app.get('/', (req,res)=>{
    return res.send('Hello world')
})

app.get('/get-room', (req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{

    console.log(`sending room id ${req.params.room}`);
    
    return res.json({
        'roomId': req.params.room
    })

})

const PORT = 4001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})