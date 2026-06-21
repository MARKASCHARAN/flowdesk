import { Server } from 'socket.io';
import logger from '../logger/index.js';
import { config } from '../config/env.js';
import jwt from 'jsonwebtoken';
import { redis } from '../cache/redis.js';

let io;

/**
 * Initialize Socket.io server and attach it to the Express HTTP Server
 */
export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.env === 'production' ? process.env.FRONTEND_URL : '*',
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication Error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded; // { id, tenantId, roles, etc }
      next();
    } catch (err) {
      return next(new Error('Authentication Error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(
      `[Socket] User ${socket.user.id} connected. Socket ID: ${socket.id}`
    );

    // Automatically join the user to their tenant's global room
    // This allows broadcasting global events to all online users in a tenant.
    const tenantRoom = `tenant_${socket.user.tenantId}`;
    socket.join(tenantRoom);

    // Also join a private room just for this user
    socket.join(`user_${socket.user.id}`);

    // PRESENCE: Mark user as online in Redis
    await redis.sadd(`presence:${socket.user.tenantId}`, socket.user.id);
    io.to(tenantRoom).emit('presence:online', { userId: socket.user.id });

    // Handle joining a specific ticket room (for live comments/typing)
    socket.on('ticket:join', (ticketId) => {
      const ticketRoom = `ticket_${ticketId}`;
      socket.join(ticketRoom);
      logger.info(`[Socket] User ${socket.user.id} joined ${ticketRoom}`);
    });

    socket.on('ticket:leave', (ticketId) => {
      const ticketRoom = `ticket_${ticketId}`;
      socket.leave(ticketRoom);
    });

    // Handle typing indicators
    socket.on('ticket:typing', ({ ticketId, isTyping }) => {
      // Broadcast to everyone else in the ticket room
      socket.to(`ticket_${ticketId}`).emit('ticket:typing', {
        userId: socket.user.id,
        isTyping,
      });
    });

    socket.on('disconnect', async () => {
      logger.info(`[Socket] User ${socket.user.id} disconnected.`);

      // Check if user has any other active sockets
      const userSockets = await io.in(`user_${socket.user.id}`).fetchSockets();
      if (userSockets.length === 0) {
        // PRESENCE: Mark user as offline
        await redis.srem(`presence:${socket.user.tenantId}`, socket.user.id);
        io.to(tenantRoom).emit('presence:offline', { userId: socket.user.id });
      }
    });
  });

  logger.info('[Socket] WebSockets initialized successfully');
  return io;
};

/**
 * Returns the initialized Socket.io instance.
 * Used by controllers/services to emit live events.
 */
export const getSocketServer = () => {
  if (!io) {
    return null; // Return null in test environments instead of crashing
  }
  return io;
};
