import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import logger from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import listingRoutes from './routes/listing.routes';
import inquiryRoutes from './routes/inquiry.routes';
import healthRoutes from './routes/health.routes';

const app = Fastify({
  logger: false, // We use our custom logger utility
});

// Centralized Error Handling
app.setErrorHandler(errorHandler);

// Security Plugins
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
});

app.register(cors, {
  origin: true,
  credentials: true,
});

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Auth Plugins
app.register(cookie, {
  secret: process.env.COOKIE_SECRET || 'aura-luxury-cookie-secret-key-1029',
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'aura-luxury-jwt-secret-key-8839',
  cookie: {
    cookieName: 'access_token',
    signed: false,
  },
});

// Swagger Auto-Documentation
app.register(swagger, {
  openapi: {
    info: {
      title: 'AURA Luxury Real Estate Platform API',
      description:
        'High-performance, enterprise-grade REST API powering the AURA luxury real estate website.',
      version: '1.0.0',
    },
    servers: [{ url: '/' }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'access_token',
        },
      },
    },
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
});

// Serve Frontend Static Files
const publicDir = path.resolve(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  app.register(fastifyStatic, {
    root: publicDir,
    prefix: '/',
  });
}

// Register API Endpoints
app.register(healthRoutes);
app.register(authRoutes, { prefix: '/api/auth' });
app.register(listingRoutes, { prefix: '/api/listings' });
app.register(inquiryRoutes, { prefix: '/api/inquiries' });

export default app;

