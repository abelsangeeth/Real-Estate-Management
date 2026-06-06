"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingService = exports.ListingService = void 0;
const listing_repository_1 = __importDefault(require("../repositories/listing.repository"));
const cache_service_1 = __importDefault(require("./cache.service"));
const error_middleware_1 = require("../middleware/error.middleware");
class ListingService {
    async getListings(filters) {
        const cacheKey = `listings:query:${JSON.stringify(filters)}`;
        const cached = await cache_service_1.default.get(cacheKey);
        if (cached) {
            return cached;
        }
        const listings = await listing_repository_1.default.findAll(filters);
        await cache_service_1.default.set(cacheKey, listings, 300); // cache for 5 minutes
        return listings;
    }
    async getListingById(id) {
        const cacheKey = `listings:id:${id}`;
        const cached = await cache_service_1.default.get(cacheKey);
        if (cached) {
            return cached;
        }
        const listing = await listing_repository_1.default.findById(id);
        if (!listing) {
            throw new error_middleware_1.AppError(404, 'Property listing not found.');
        }
        await cache_service_1.default.set(cacheKey, listing, 300);
        return listing;
    }
    async createListing(data) {
        const listing = await listing_repository_1.default.create(data);
        await this.invalidateCache(listing.id);
        return listing;
    }
    async updateListing(id, data) {
        // Verify listing existence first
        await this.getListingById(id);
        const listing = await listing_repository_1.default.update(id, data);
        await this.invalidateCache(id);
        return listing;
    }
    async deleteListing(id) {
        // Verify listing existence first
        await this.getListingById(id);
        const listing = await listing_repository_1.default.delete(id);
        await this.invalidateCache(id);
        return listing;
    }
    async invalidateCache(id) {
        if (id) {
            await cache_service_1.default.del(`listings:id:${id}`);
        }
        // Flush overall listing cache queries
        await cache_service_1.default.clear();
    }
}
exports.ListingService = ListingService;
exports.listingService = new ListingService();
exports.default = exports.listingService;
//# sourceMappingURL=listing.service.js.map