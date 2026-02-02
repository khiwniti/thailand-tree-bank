import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Initialize clients
const prisma = new PrismaClient();

// Initialize Redis client (optional)
let redisClient: ReturnType<typeof createClient> | null = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: process.env.REDIS_TLS === 'true',
      servername: process.env.REDIS_SNI,
    },
  });

  // Connect to Redis
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => console.log('✅ Connected to Redis'));
} else {
  console.warn('⚠️ REDIS_URL not set - Redis caching disabled');
}

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(morgan('dev')); // Request logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection (optional)
    let redisStatus = 'disabled';
    if (redisClient) {
      try {
        const redisPing = await redisClient.ping();
        redisStatus = redisPing === 'PONG' ? 'connected' : 'disconnected';
      } catch (err) {
        redisStatus = 'error';
      }
    }

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      redis: redisStatus,
      version: '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'Tree Bank API',
    version: '1.0.0',
    description: 'Backend API for Thailand Tree Bank LINE Mini App',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      plots: '/api/plots/*',
      trees: '/api/trees/*',
      documents: '/api/documents/*',
      carbon: '/api/carbon/*',
      verifications: '/api/verifications/*',
    },
  });
});

// Auth routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

// Plot routes
import plotRoutes from './routes/plots.js';
app.use('/api/plots', plotRoutes);

// Tree routes
import treeRoutes from './routes/trees.js';
app.use('/api/trees', treeRoutes);

// Document routes
import documentRoutes from './routes/documents.js';
app.use('/api/documents', documentRoutes);

// Carbon credit routes
import carbonRoutes from './routes/carbon.js';
app.use('/api/carbon', carbonRoutes);

// Verification routes
import verificationRoutes from './routes/verifications.js';
app.use('/api/verifications', verificationRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Start server
async function startServer() {
  try {
    // Connect to Redis (optional)
    if (redisClient) {
      try {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
      } catch (err) {
        console.warn('⚠️ Redis connection failed, continuing without cache:', err);
      }
    }

    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (redisClient) {
    await redisClient.quit();
  }
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, shutting down...');
  if (redisClient) {
    await redisClient.quit();
  }
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();

// Export for testing
export { app, prisma, redisClient };
