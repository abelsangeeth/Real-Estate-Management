import { FastifyRequest, FastifyReply } from 'fastify';
export interface DecodedToken {
    id: string;
    email: string;
    role: string;
    name: string;
}
export declare const authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const authorize: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
