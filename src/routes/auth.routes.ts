import { FastifyInstance } from 'fastify';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.post('/logout', authController.logout);
  fastify.get('/me', { preValidation: authenticate }, authController.me);
}
