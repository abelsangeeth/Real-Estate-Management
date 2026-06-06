"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const mockDb_1 = require("../utils/mockDb");
class UserRepository {
    async findByEmail(email) {
        await (0, mockDb_1.initMockDb)();
        const user = mockDb_1.mockUsers.find((u) => u.email === email);
        return user || null;
    }
    async findById(id) {
        await (0, mockDb_1.initMockDb)();
        const user = mockDb_1.mockUsers.find((u) => u.id === id);
        return user || null;
    }
    async create(data) {
        await (0, mockDb_1.initMockDb)();
        const newUser = {
            id: `usr-${Date.now()}`,
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role || 'buyer',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockDb_1.mockUsers.push(newUser);
        return newUser;
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
exports.default = exports.userRepository;
//# sourceMappingURL=user.repository.js.map