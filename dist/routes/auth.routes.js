"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
async function authRoutes(fastify) {
    fastify.post('/register', auth_controller_1.default.register);
    fastify.post('/login', auth_controller_1.default.login);
    fastify.post('/logout', auth_controller_1.default.logout);
    fastify.get('/me', { preValidation: auth_middleware_1.authenticate }, auth_controller_1.default.me);
}
//# sourceMappingURL=auth.routes.js.map