"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const db_1 = __importDefault(require("../utils/db"));
class UserRepository {
    async findByEmail(email) {
        return db_1.default.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return db_1.default.user.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return db_1.default.user.create({
            data,
        });
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
exports.default = exports.userRepository;
//# sourceMappingURL=user.repository.js.map