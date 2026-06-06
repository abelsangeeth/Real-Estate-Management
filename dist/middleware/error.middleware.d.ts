import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
export declare class AppError extends Error {
    statusCode: number;
    details: any;
    constructor(statusCode: number, message: string, details?: any);
}
export declare const errorHandler: (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
