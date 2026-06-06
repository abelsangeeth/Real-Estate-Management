import { FastifyRequest, FastifyReply } from 'fastify';
import listingService from '../services/listing.service';
import { z } from 'zod';

const listingQuerySchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  isFeatured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.number().positive('Price must be a positive number.'),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  areaSqFt: z.number().positive(),
  imageUrl: z.string(),
  isFeatured: z.boolean().default(false),
  amenities: z.string(),
});

export class ListingController {
  async getListings(request: FastifyRequest, reply: FastifyReply) {
    const filters = listingQuerySchema.parse(request.query);
    const listings = await listingService.getListings(filters);
    return reply.send({ success: true, data: listings });
  }

  async getListingById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const listing = await listingService.getListingById(id);
    return reply.send({ success: true, data: listing });
  }

  async createListing(request: FastifyRequest, reply: FastifyReply) {
    const data = createListingSchema.parse(request.body);
    const listing = await listingService.createListing(data);
    return reply.status(201).send({ success: true, data: listing });
  }

  async updateListing(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = createListingSchema.partial().parse(request.body);
    const listing = await listingService.updateListing(id, data);
    return reply.send({ success: true, data: listing });
  }

  async deleteListing(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const listing = await listingService.deleteListing(id);
    return reply.send({ success: true, data: listing });
  }
}

export const listingController = new ListingController();
export default listingController;
