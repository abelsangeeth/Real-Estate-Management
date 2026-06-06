"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = inquiryRoutes;
const inquiry_controller_1 = __importDefault(require("../controllers/inquiry.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
async function inquiryRoutes(fastify) {
    // Allow anonymous or authenticated tour inquiry requests
    fastify.post('/', {
        preValidation: async (request, reply) => {
            try {
                await (0, auth_middleware_1.authenticate)(request, reply);
            }
            catch {
                // Allow anonymous posting
            }
        },
    }, inquiry_controller_1.default.createInquiry);
    // Querying inquiries requires authentication
    fastify.get('/', { preValidation: auth_middleware_1.authenticate }, inquiry_controller_1.default.getInquiries);
}
//# sourceMappingURL=inquiry.routes.js.map