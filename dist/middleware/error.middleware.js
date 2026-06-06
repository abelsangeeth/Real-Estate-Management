"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
class AppError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const errorHandler = (error, request, reply) => {
    // Log the error
    logger_1.default.error({
        msg: error.message,
        stack: error.stack,
        url: request.raw.url,
        method: request.raw.method,
    });
    // Handle AppError
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            error: error.message,
            details: error.details,
        });
    }
    // Handle Zod Validation Errors
    if (error instanceof zod_1.ZodError) {
        return reply.status(400).send({
            success: false,
            error: 'Validation Error',
            details: error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            })),
        });
    }
    // Handle Fastify Validation Errors (sometimes thrown directly)
    if ('validation' in error) {
        return reply.status(400).send({
            success: false,
            error: 'Validation Error',
            details: error.validation,
        });
    }
    // Handle JWT/Auth Errors
    if (error.statusCode === 401 ||
        error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE' ||
        error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
        return reply.status(401).send({
            success: false,
            error: 'Unauthorized',
            details: 'Access token is missing, invalid, or expired.',
        });
    }
    // Handle Database Errors
    if (error.message && error.message.includes('Prisma')) {
        if (error.message.includes('P2002')) {
            return reply.status(409).send({
                success: false,
                error: 'Conflict Error',
                details: 'A record with this unique field already exists.',
            });
        }
        return reply.status(500).send({
            success: false,
            error: 'Database Error',
            details: process.env.NODE_ENV === 'development'
                ? error.message
                : 'A database constraint violation occurred.',
        });
    }
    // Fallback
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : null,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map