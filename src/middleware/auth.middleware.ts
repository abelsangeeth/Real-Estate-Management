import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from './error.middleware';

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    let token = '';
    const cookieToken = request.cookies.access_token;

    if (cookieToken) {
      token = cookieToken;
    } else {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new AppError(401, 'Authentication credentials required.');
    }

    const decoded = request.server.jwt.verify<DecodedToken>(token);
    request.user = decoded;
  } catch (err: any) {
    throw new AppError(401, err.message || 'Session expired or invalid token.');
  }
};

export const authorize = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new AppError(401, 'User must be authenticated.');
    }
    const user = request.user as DecodedToken;
    if (!roles.includes(user.role)) {
      throw new AppError(403, 'You do not have administrative access for this resource.');
    }
  };
};
