"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryRepository = exports.InquiryRepository = void 0;
const db_1 = __importDefault(require("../utils/db"));
class InquiryRepository {
    async create(data) {
        return db_1.default.inquiry.create({
            data,
        });
    }
    async findAll() {
        return db_1.default.inquiry.findMany({
            include: {
                listing: {
                    select: {
                        title: true,
                        price: true,
                        location: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUserId(userId) {
        return db_1.default.inquiry.findMany({
            where: { userId },
            include: {
                listing: {
                    select: {
                        title: true,
                        price: true,
                        location: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.InquiryRepository = InquiryRepository;
exports.inquiryRepository = new InquiryRepository();
exports.default = exports.inquiryRepository;
//# sourceMappingURL=inquiry.repository.js.map