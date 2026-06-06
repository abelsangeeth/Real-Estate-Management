"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format.'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters.'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters.'),
    role: zod_1.z.enum(['admin', 'agent', 'buyer']).default('buyer'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format.'),
    password: zod_1.z.string().min(1, 'Password is required.'),
});
class AuthController {
    async register(request, reply) {
        const data = registerSchema.parse(request.body);
        const user = await auth_service_1.default.register(data);
        return reply.status(201).send({ success: true, data: user });
    }
    async login(request, reply) {
        const data = loginSchema.parse(request.body);
        const user = await auth_service_1.default.login(data.email, data.password);
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };
        const token = request.server.jwt.sign(tokenPayload, { expiresIn: '1d' });
        const refreshToken = request.server.jwt.sign({ id: user.id }, { expiresIn: '7d' });
        reply.setCookie('access_token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 1 day
        });
        reply.setCookie('refresh_token', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        return reply.send({
            success: true,
            data: {
                user,
                token,
            },
        });
    }
    async logout(request, reply) {
        reply.clearCookie('access_token', { path: '/' });
        reply.clearCookie('refresh_token', { path: '/' });
        return reply.send({ success: true, message: 'Logged out successfully.' });
    }
    async me(request, reply) {
        if (!request.user) {
            return reply.status(401).send({ success: false, error: 'Unauthorized.' });
        }
        const decoded = request.user;
        const user = await auth_service_1.default.getUserById(decoded.id);
        return reply.send({ success: true, data: user });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
exports.default = exports.authController;
//# sourceMappingURL=auth.controller.js.map