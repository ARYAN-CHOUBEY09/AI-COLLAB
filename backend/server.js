import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('Invalid projectId'));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error('Authentication error'));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
});



io.on('connection', (socket) => {
  if (!socket.project || !socket.project._id) {
    console.log(
      `⚠️ Socket ${socket.id} connected without a valid project, skipping room join`
    );
    return;
  }

  socket.roomId = socket.project._id.toString();
  socket.join(socket.roomId);

  console.log(`✅ User connected: ${socket.id} | Joined room: ${socket.roomId}`);

  

  socket.on('project-message', async (data) => {
    const message = data.message;

    io.to(socket.roomId).emit('project-message', data);

    if (!message.includes('@ai')) return;

    const prompt = message.split('@ai')[1]?.trim();
    if (!prompt) return;

    try {
      const result = await generateResult(prompt);

      io.to(socket.roomId).emit('project-message', {
        message: result,
        sender: {
          _id: 'ai',
          email: 'AI',
        },
      });
    } catch (error) {
      io.to(socket.roomId).emit('project-message', {
        message: '⚠️ AI service is currently unavailable.',
        sender: {
          _id: 'ai',
          email: 'AI',
        },
      });
    }
  });

 
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.roomId) socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});