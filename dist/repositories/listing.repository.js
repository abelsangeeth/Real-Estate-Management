"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingRepository = exports.ListingRepository = void 0;
const db_1 = __importDefault(require("../utils/db"));
class ListingRepository {
    async findAll(filters = {}) {
        const where = {};
        if (filters.location) {
            where.location = { contains: filters.location };
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice !== undefined)
                where.price.lte = filters.maxPrice;
        }
        if (filters.bedrooms !== undefined) {
            where.bedrooms = { gte: filters.bedrooms };
        }
        if (filters.isFeatured !== undefined) {
            where.isFeatured = filters.isFeatured;
        }
        return db_1.default.listing.findMany({
            where,
            orderBy: { price: 'asc' }, // premium listing sort order
        });
    }
    async findById(id) {
        return db_1.default.listing.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return db_1.default.listing.create({
            data,
        });
    }
    async update(id, data) {
        return db_1.default.listing.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return db_1.default.listing.delete({
            where: { id },
        });
    }
}
exports.ListingRepository = ListingRepository;
exports.listingRepository = new ListingRepository();
exports.default = exports.listingRepository;
//# sourceMappingURL=listing.repository.js.map