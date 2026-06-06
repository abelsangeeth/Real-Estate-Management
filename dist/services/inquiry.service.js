"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryService = exports.InquiryService = void 0;
const inquiry_repository_1 = __importDefault(require("../repositories/inquiry.repository"));
const listing_repository_1 = __importDefault(require("../repositories/listing.repository"));
const error_middleware_1 = require("../middleware/error.middleware");
class InquiryService {
    async createInquiry(data) {
        // Validate listing association
        const listing = await listing_repository_1.default.findById(data.listingId);
        if (!listing) {
            throw new error_middleware_1.AppError(404, 'The requested property listing does not exist.');
        }
        return inquiry_repository_1.default.create(data);
    }
    async getAllInquiries() {
        return inquiry_repository_1.default.findAll();
    }
    async getInquiriesByUserId(userId) {
        return inquiry_repository_1.default.findByUserId(userId);
    }
}
exports.InquiryService = InquiryService;
exports.inquiryService = new InquiryService();
exports.default = exports.inquiryService;
//# sourceMappingURL=inquiry.service.js.map