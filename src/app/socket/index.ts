import type http from 'http';
import { Server, type Socket } from 'socket.io';
import config from '../config';
import { verifyToken } from '../modules/auth/auth.utils';
import { type TJwtPayload } from '../modules/auth/auth.interface';
import { type JwtPayload } from 'jsonwebtoken';

let io: Server | null = null;

export const initSocket = (httpServer: http.Server): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: config.client_url,
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token as string | undefined;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      // Verify utilizing the same REST JWT verification logic
      const decoded = verifyToken(token, config.jwt_access_token_secret_key) as JwtPayload &
        TJwtPayload;
      if (!decoded) {
        return next(new Error('Invalid token'));
      }

      // Attach user details to socket data
      (socket.data as Record<string, unknown>).user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // Connection Handler
  io.on('connection', (socket: Socket) => {
    try {
      const user = (socket.data as Record<string, unknown>).user as TJwtPayload | undefined;
      if (!user) {
        socket.disconnect(true);
        return;
      }

      const { role, id, email } = user;

      // Observable logging
      // eslint-disable-next-line no-console
      console.log(`🔌 Client connected: ${email} (Role: ${role})`);

      // Join rooms by role
      if (role === 'Admin' || role === 'Manager') {
        void socket.join('admin-manager-room');
      }

      // Join personal room for per-user events
      void socket.join(`user-${id}`);

      // Observable logout/disconnect
      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log(`🔌 Client disconnected: ${email}`);
      });
    } catch (err) {
      console.error('Defensive wrapper: Socket connection handling error', err);
    }
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
