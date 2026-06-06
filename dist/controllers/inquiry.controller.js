"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryController = exports.InquiryController = void 0;
const inquiry_service_1 = __importDefault(require("../services/inquiry.service"));
const zod_1 = require("zod");
const createInquirySchema = zod_1.z.object({
    clientName: zod_1.z.string().min(2, 'Name must be at least 2 characters.'),
    clientEmail: zod_1.z.string().email('Invalid email address.'),
    clientPhone: zod_1.z.string().min(6, 'Invalid phone number.'),
    message: zod_1.z.string().min(10, 'Message must be at least 10 characters.'),
    requestedTourDate: zod_1.z.string().optional(),
    listingId: zod_1.z.string(),
});
class InquiryController {
    async createInquiry(request, reply) {
        const data = createInquirySchema.parse(request.body);
        const decodedUser = request.user;
        const userId = decodedUser?.id || null;
        const inquiry = await inquiry_service_1.default.createInquiry({
            ...data,
            userId,
        });
        return reply.status(201).send({ success: true, data: inquiry });
    }
    async getInquiries(request, reply) {
        const decodedUser = request.user;
        const userRole = decodedUser.role;
        let inquiries;
        if (userRole === 'admin' || userRole === 'agent') {
            inquiries = await inquiry_service_1.default.getAllInquiries();
        }
        else {
            inquiries = await inquiry_service_1.default.getInquiriesByUserId(decodedUser.id);
        }
        return reply.send({ success: true, data: inquiries });
    }
}
exports.InquiryController = InquiryController;
exports.inquiryController = new InquiryController();
exports.default = exports.inquiryController;
//# sourceMappingURL=inquiry.controller.js.map