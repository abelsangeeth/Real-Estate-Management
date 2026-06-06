import { FastifyInstance } from 'fastify';
import listingController from '../controllers/listing.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

export default async function listingRoutes(fastify: FastifyInstance) {
  fastify.get('/', listingController.getListings);
  fastify.get('/:id', listingController.getListingById);

  fastify.post(
    '/',
    { preValidation: [authenticate, authorize(['agent', 'admin'])] },
    listingController.createListing
  );

  fastify.put(
    '/:id',
    { preValidation: [authenticate, authorize(['agent', 'admin'])] },
    listingController.updateListing
  );

  fastify.delete(
    '/:id',
    { preValidation: [authenticate, authorize(['agent', 'admin'])] },
    listingController.deleteListing
  );
}
