"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const error_middleware_1 = require("./error.middleware");
const authenticate = async (request, reply) => {
    try {
        let token = '';
        const cookieToken = request.cookies.access_token;
        if (cookieToken) {
            token = cookieToken;
        }
        else {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        if (!token) {
            throw new error_middleware_1.AppError(401, 'Authentication credentials required.');
        }
        const decoded = request.server.jwt.verify(token);
        request.user = decoded;
    }
    catch (err) {
        throw new error_middleware_1.AppError(401, err.message || 'Session expired or invalid token.');
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return async (request, reply) => {
        if (!request.user) {
            throw new error_middleware_1.AppError(401, 'User must be authenticated.');
        }
        const user = request.user;
        if (!roles.includes(user.role)) {
            throw new error_middleware_1.AppError(403, 'You do not have administrative access for this resource.');
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map