// Socket.IO server setup
import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected');

      // Join user to their personal room
      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      // Handle new message
      socket.on('sendMessage', (data) => {
        // Broadcast to receiver
        socket.to(data.receiverId).emit('newMessage', data);
      });

      // Handle new notification
      socket.on('sendNotification', (data) => {
        // Broadcast to specific user
        socket.to(data.userId).emit('newNotification', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  res.end();
};

export default SocketHandler;