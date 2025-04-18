const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

let tasks = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('sync:tasks', tasks);

  socket.on('task:create', (task) => {
    tasks.push(task);
    io.emit('sync:tasks', tasks);
  });

  socket.on('task:update', (updatedTask) => {
    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    io.emit('sync:tasks', tasks);
  });

  socket.on('task:move', ({ taskId, newColumn }) => {
    tasks = tasks.map(task =>
      task.id === taskId ? { ...task, column: newColumn } : task
    );
    io.emit('sync:tasks', tasks);
  });

  socket.on('task:delete', (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    io.emit('sync:tasks', tasks);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('WebSocket server running on http://localhost:3001');
});
