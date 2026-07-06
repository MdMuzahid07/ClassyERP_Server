/* eslint-disable no-console */
import http, { type Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { initSocket } from './app/socket';

let server: Server;

// ===== Catch synchronous errors =====
process.on('uncaughtException', (error: Error) => {
  console.error('😈 UNCAUGHT EXCEPTION! Shutting down immediately...');
  console.error('Name:', error.name);
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

// ===== Graceful Shutdown Helper =====
async function gracefulShutdown(signal: string, exitCode = 0) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error('❌ Error closing HTTP server:', err);
        process.exit(1);
      }

      console.log('🔴 HTTP server closed');

      try {
        await mongoose.connection.close(false);
        console.log('🍃 MongoDB connection closed');
        console.log('✅ Graceful shutdown completed');
        process.exit(exitCode);
      } catch (error) {
        console.error('❌ Error during database shutdown:', error);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.error('⚠️ Forced shutdown after 30s timeout');
      process.exit(1);
    }, 30000);
  } else {
    try {
      await mongoose.connection.close(false);
      console.log('🍃 MongoDB connection closed');
    } catch (error) {
      console.error('❌ Error closing database:', error);
    }
    process.exit(exitCode);
  }
}

async function main() {
  try {
    await mongoose.connect(config.database_url, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      compressors: ['zlib'],
      family: 4,
    });

    console.log('🍃 MongoDB connected successfully');
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
    console.log(`🗄️  Database: ${mongoose.connection.name}`);

    const httpServer = http.createServer(app);
    initSocket(httpServer);
    server = httpServer.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });

    // MongoDB connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('🍃 MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    mongoose.connection.on('close', () => {
      console.log('🍃 MongoDB connection closed');
    });
  } catch (error) {
    console.error('💥 Failed to start application:', error);
    process.exit(1);
  }
}

void main();

// ===== Process Signal Handlers =====
process.on('unhandledRejection', (reason: Error) => {
  console.error('😈 UNHANDLED REJECTION! Shutting down...');
  console.error('Reason:', reason.name, reason.message);
  void gracefulShutdown('unhandledRejection', 1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received');
  void gracefulShutdown('SIGTERM', 0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT signal received (Ctrl+C)');
  void gracefulShutdown('SIGINT', 0);
});
