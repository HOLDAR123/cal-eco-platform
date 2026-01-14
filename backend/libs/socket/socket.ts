import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';
import mockData from '../data/mockData';
import { SocketJoinData, SocketChatData } from '../types';

interface User {
  socketId: string;
  username: string;
  room: string;
}

class SocketService {
  private activeUsers: Map<string, User>;

  constructor() {
    this.activeUsers = new Map();
  }

  newUser(socketId: string, username: string, room: string): User {
    const user = { socketId, username, room };
    this.activeUsers.set(socketId, user);
    return user;
  }

  getActiveUser(socketId: string): User | undefined {
    return this.activeUsers.get(socketId);
  }

  exitRoom(socketId: string): User | undefined {
    const user = this.activeUsers.get(socketId);
    if (user) {
      this.activeUsers.delete(socketId);
    }
    return user;
  }

  getIndividualRoomUsers(room: string): User[] {
    const users: User[] = [];
    this.activeUsers.forEach((user) => {
      if (user.room === room) {
        users.push(user);
      }
    });
    return users;
  }

  async handleJoinRoom(socket: Socket, data: string | SocketJoinData, io: Server): Promise<void> {
    try {
      const receiveData: SocketJoinData = typeof data === 'string' ? JSON.parse(data) : data;
      const ticketId = receiveData.room;

      if (!ticketId) {
        socket.emit('error', { message: 'Room ID is required' });
        return;
      }

      const ticketIdNumber = typeof ticketId === 'number' ? ticketId : parseInt(String(ticketId), 10);
      if (isNaN(ticketIdNumber)) {
        socket.emit('error', { message: 'Invalid room ID' });
        return;
      }

      const ticketMessages = mockData.getTicketMessagesByTicketId(ticketIdNumber);

      if (ticketMessages.length > 0) {
        const roomString = String(ticketIdNumber);
        const user = this.newUser(socket.id, receiveData.username, roomString);
        socket.join(user.room);

        io.to(user.room).emit('roomUsers', {
          chatHistory: ticketMessages,
          room: user.room,
          users: this.getIndividualRoomUsers(user.room),
        });
      }
    } catch (error) {
      logger.error('Error handling join room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  async handleChatMessage(socket: Socket, data: string | SocketChatData, io: Server): Promise<void> {
    try {
      const newChatHistory: SocketChatData = typeof data === 'string' ? JSON.parse(data) : data;
      const { ticket_id: ticketId, sender, receiver, message } = newChatHistory;

      if (!ticketId || !sender || !message) {
        socket.emit('error', { message: 'Missing required fields' });
        return;
      }

      const ticketIdNumber = typeof ticketId === 'number' ? ticketId : parseInt(String(ticketId), 10);
      if (isNaN(ticketIdNumber)) {
        socket.emit('error', { message: 'Invalid ticket ID' });
        return;
      }

      mockData.createTicketMessage({
        ticket_id: ticketIdNumber,
        user_id: sender,
        message,
        is_admin: receiver ? 0 : 1,
      });

      const user = this.getActiveUser(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not found in active users' });
        return;
      }

      const ticketMessages = mockData.getTicketMessagesByTicketId(ticketIdNumber);

      io.to(user.room).emit('message', {
        username: user.username,
        messages: ticketMessages,
      });
    } catch (error) {
      logger.error('Error handling chat message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  handleDisconnect(socket: Socket, io: Server): void {
    const user = this.exitRoom(socket.id);
    if (user) {
      logger.info(`User ${user.username} has left room ${user.room}`);
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: this.getIndividualRoomUsers(user.room),
      });
    }
  }

  initializeSocket(io: Server): void {
    io.on('connection', (socket: Socket) => {
      logger.info('Socket connected:', socket.id);

      socket.on('joinRoom', async (data) => {
        await this.handleJoinRoom(socket, data, io);
      });

      socket.on('chatMessage', async (data) => {
        await this.handleChatMessage(socket, data, io);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket, io);
      });
    });
  }
}

export default new SocketService();
