"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingController = exports.ListingController = void 0;
const listing_service_1 = __importDefault(require("../services/listing.service"));
const zod_1 = require("zod");
const listingQuerySchema = zod_1.z.object({
    location: zod_1.z.string().optional(),
    minPrice: zod_1.z.coerce.number().optional(),
    maxPrice: zod_1.z.coerce.number().optional(),
    bedrooms: zod_1.z.coerce.number().optional(),
    isFeatured: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .optional(),
});
const createListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters.'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters.'),
    price: zod_1.z.number().positive('Price must be a positive number.'),
    location: zod_1.z.string().min(3, 'Location must be at least 3 characters.'),
    bedrooms: zod_1.z.number().int().nonnegative(),
    bathrooms: zod_1.z.number().nonnegative(),
    areaSqFt: zod_1.z.number().positive(),
    imageUrl: zod_1.z.string(),
    isFeatured: zod_1.z.boolean().default(false),
    amenities: zod_1.z.string(),
});
class ListingController {
    async getListings(request, reply) {
        const filters = listingQuerySchema.parse(request.query);
        const listings = await listing_service_1.default.getListings(filters);
        return reply.send({ success: true, data: listings });
    }
    async getListingById(request, reply) {
        const { id } = request.params;
        const listing = await listing_service_1.default.getListingById(id);
        return reply.send({ success: true, data: listing });
    }
    async createListing(request, reply) {
        const data = createListingSchema.parse(request.body);
        const listing = await listing_service_1.default.createListing(data);
        return reply.status(201).send({ success: true, data: listing });
    }
    async updateListing(request, reply) {
        const { id } = request.params;
        const data = createListingSchema.partial().parse(request.body);
        const listing = await listing_service_1.default.updateListing(id, data);
        return reply.send({ success: true, data: listing });
    }
    async deleteListing(request, reply) {
        const { id } = request.params;
        const listing = await listing_service_1.default.deleteListing(id);
        return reply.send({ success: true, data: listing });
    }
}
exports.ListingController = ListingController;
exports.listingController = new ListingController();
exports.default = exports.listingController;
//# sourceMappingURL=listing.controller.js.map