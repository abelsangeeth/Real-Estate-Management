"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const error_middleware_1 = require("../middleware/error.middleware");
class AuthService {
    async register(data) {
        const existing = await user_repository_1.default.findByEmail(data.email);
        if (existing) {
            throw new error_middleware_1.AppError(409, 'A user with this email already exists.');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
        const user = await user_repository_1.default.create({
            ...data,
            password: hashedPassword,
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async login(email, passwordPlain) {
        const user = await user_repository_1.default.findByEmail(email);
        if (!user) {
            throw new error_middleware_1.AppError(401, 'Invalid email or password credentials.');
        }
        const isMatch = await bcrypt_1.default.compare(passwordPlain, user.password);
        if (!isMatch) {
            throw new error_middleware_1.AppError(401, 'Invalid email or password credentials.');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getUserById(id) {
        const user = await user_repository_1.default.findById(id);
        if (!user) {
            throw new error_middleware_1.AppError(404, 'User not found.');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
exports.default = exports.authService;
//# sourceMappingURL=auth.service.js.map