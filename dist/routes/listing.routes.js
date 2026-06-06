"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listingRoutes;
const listing_controller_1 = __importDefault(require("../controllers/listing.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
async function listingRoutes(fastify) {
    fastify.get('/', listing_controller_1.default.getListings);
    fastify.get('/:id', listing_controller_1.default.getListingById);
    fastify.post('/', { preValidation: [auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['agent', 'admin'])] }, listing_controller_1.default.createListing);
    fastify.put('/:id', { preValidation: [auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['agent', 'admin'])] }, listing_controller_1.default.updateListing);
    fastify.delete('/:id', { preValidation: [auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['agent', 'admin'])] }, listing_controller_1.default.deleteListing);
}
//# sourceMappingURL=listing.routes.js.map