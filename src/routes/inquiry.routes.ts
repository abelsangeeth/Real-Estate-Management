import { FastifyInstance } from 'fastify';
import inquiryController from '../controllers/inquiry.controller';
import { authenticate } from '../middleware/auth.middleware';

export default async function inquiryRoutes(fastify: FastifyInstance) {
  // Allow anonymous or authenticated tour inquiry requests
  fastify.post(
    '/',
    {
      preValidation: async (request, reply) => {
        try {
          await authenticate(request, reply);
        } catch {
          // Allow anonymous posting
        }
      },
    },
    inquiryController.createInquiry
  );

  // Querying inquiries requires authentication
  fastify.get('/', { preValidation: authenticate }, inquiryController.getInquiries);
}
