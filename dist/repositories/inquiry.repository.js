"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryRepository = exports.InquiryRepository = void 0;
const mockDb_1 = require("../utils/mockDb");
class InquiryRepository {
    async create(data) {
        await (0, mockDb_1.initMockDb)();
        const listing = mockDb_1.mockListings.find((l) => l.id === data.listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }
        const newInquiry = {
            id: `inq-${Date.now()}`,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            message: data.message,
            requestedTourDate: data.requestedTourDate ?? null,
            listingId: data.listingId,
            userId: data.userId ?? null,
            createdAt: new Date(),
            listing: {
                title: listing.title,
                price: listing.price,
                location: listing.location,
            },
        };
        mockDb_1.mockInquiries.push(newInquiry);
        const { listing: _, ...inquiryObj } = newInquiry;
        return inquiryObj;
    }
    async findAll() {
        await (0, mockDb_1.initMockDb)();
        return mockDb_1.mockInquiries;
    }
    async findByUserId(userId) {
        await (0, mockDb_1.initMockDb)();
        return mockDb_1.mockInquiries.filter((i) => i.userId === userId);
    }
}
exports.InquiryRepository = InquiryRepository;
exports.inquiryRepository = new InquiryRepository();
exports.default = exports.inquiryRepository;
//# sourceMappingURL=inquiry.repository.js.map