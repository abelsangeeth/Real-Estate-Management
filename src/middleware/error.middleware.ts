import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details: any = null
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  // Log the error
  logger.error({
    msg: error.message,
    stack: error.stack,
    url: request.raw.url,
    method: request.raw.method,
  });

  // Handle AppError
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: error.message,
      details: error.details,
    });
  }

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: 'Validation Error',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Handle Fastify Validation Errors (sometimes thrown directly)
  if ('validation' in error) {
    return reply.status(400).send({
      success: false,
      error: 'Validation Error',
      details: error.validation,
    });
  }

  // Handle JWT/Auth Errors
  if (
    error.statusCode === 401 ||
    error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE' ||
    error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED'
  ) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      details: 'Access token is missing, invalid, or expired.',
    });
  }

  // Handle Database Errors (simulated by generic errors if needed)
  if (error.message && error.message.includes('Database Error')) {
    return reply.status(500).send({
      success: false,
      error: 'Database Error',
      details:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'A database constraint violation occurred.',
    });
  }

  // Fallback
  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    success: false,
    error: statusCode === 500 ? 'Internal Server Error' : error.message,
    details: process.env.NODE_ENV === 'development' ? error.stack : null,
  });
};
