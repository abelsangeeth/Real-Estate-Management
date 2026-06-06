"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingRepository = exports.ListingRepository = void 0;
const mockDb_1 = require("../utils/mockDb");
class ListingRepository {
    async findAll(filters = {}) {
        await (0, mockDb_1.initMockDb)();
        let result = [...mockDb_1.mockListings];
        if (filters.location) {
            const locLower = filters.location.toLowerCase();
            result = result.filter((l) => l.location.toLowerCase().includes(locLower));
        }
        if (filters.minPrice !== undefined) {
            result = result.filter((l) => l.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            result = result.filter((l) => l.price <= filters.maxPrice);
        }
        if (filters.bedrooms !== undefined) {
            result = result.filter((l) => l.bedrooms >= filters.bedrooms);
        }
        if (filters.isFeatured !== undefined) {
            result = result.filter((l) => l.isFeatured === filters.isFeatured);
        }
        return result.sort((a, b) => a.price - b.price);
    }
    async findById(id) {
        await (0, mockDb_1.initMockDb)();
        const listing = mockDb_1.mockListings.find((l) => l.id === id);
        return listing || null;
    }
    async create(data) {
        await (0, mockDb_1.initMockDb)();
        const newListing = {
            id: `lst-${Date.now()}`,
            title: data.title,
            description: data.description,
            price: data.price,
            location: data.location,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            areaSqFt: data.areaSqFt,
            imageUrl: data.imageUrl,
            isFeatured: data.isFeatured ?? false,
            amenities: data.amenities,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockDb_1.mockListings.push(newListing);
        return newListing;
    }
    async update(id, data) {
        await (0, mockDb_1.initMockDb)();
        const index = mockDb_1.mockListings.findIndex((l) => l.id === id);
        if (index === -1) {
            throw new Error('Listing not found');
        }
        const listing = mockDb_1.mockListings[index];
        const updated = {
            ...listing,
            title: data.title ?? listing.title,
            description: data.description ?? listing.description,
            price: data.price ?? listing.price,
            location: data.location ?? listing.location,
            bedrooms: data.bedrooms ?? listing.bedrooms,
            bathrooms: data.bathrooms ?? listing.bathrooms,
            areaSqFt: data.areaSqFt ?? listing.areaSqFt,
            imageUrl: data.imageUrl ?? listing.imageUrl,
            isFeatured: data.isFeatured ?? listing.isFeatured,
            amenities: data.amenities ?? listing.amenities,
            updatedAt: new Date(),
        };
        mockDb_1.mockListings[index] = updated;
        return updated;
    }
    async delete(id) {
        await (0, mockDb_1.initMockDb)();
        const index = mockDb_1.mockListings.findIndex((l) => l.id === id);
        if (index === -1) {
            throw new Error('Listing not found');
        }
        const deleted = mockDb_1.mockListings.splice(index, 1)[0];
        return deleted;
    }
}
exports.ListingRepository = ListingRepository;
exports.listingRepository = new ListingRepository();
exports.default = exports.listingRepository;
//# sourceMappingURL=listing.repository.js.map