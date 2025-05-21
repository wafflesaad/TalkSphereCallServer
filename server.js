const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const {v4: uuidv4} = require('uuid') 

const app = express()
const server = http.createServer(app)

// Configure CORS
app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "https://talk-sphere-frontend-green.vercel.app"],
  methods: ['GET', 'POST'],
  credentials: true
}))

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'https://talk-sphere-frontend-green.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId, userId) => {
    console.log(`[${new Date().toISOString()}] User ${userId} joined room ${roomId}`)
    console.log(`[${new Date().toISOString()}] Socket ${socket.id} joining room ${roomId}`)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    console.log(`[${new Date().toISOString()}] Emitted user-connected event to room ${roomId} for user ${userId}`)
  })

  socket.on('end-call', (roomId) => {
    console.log(`[${new Date().toISOString()}] Call ended in room ${roomId}`)
    io.to(roomId).emit('call-ended')
  })

  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] User disconnected:`, socket.id)
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
