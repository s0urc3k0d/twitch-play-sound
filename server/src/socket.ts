import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

import { SOCKET } from './enum'

let io: Server

export const socketPath = '/socket'

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"]
    },
    path: '/socket.io/'
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

export const dispatchSocket = (
  method: SOCKET,
  data: any
) => {
  if (io) {
    io.emit(method, data)
  }
}
