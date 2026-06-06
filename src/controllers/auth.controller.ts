import { FastifyRequest, FastifyReply } from 'fastify';
import authService from '../services/auth.service';
import { z } from 'zod';
import { DecodedToken } from '../middleware/auth.middleware';

const registerSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  role: z.enum(['admin', 'agent', 'buyer']).default('buyer'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(1, 'Password is required.'),
});

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body);
    const user = await authService.register(data);
    return reply.status(201).send({ success: true, data: user });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body);
    const user = await authService.login(data.email, data.password);

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

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/' });
    return reply.send({ success: true, message: 'Logged out successfully.' });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      return reply.status(401).send({ success: false, error: 'Unauthorized.' });
    }
    const decoded = request.user as DecodedToken;
    const user = await authService.getUserById(decoded.id);
    return reply.send({ success: true, data: user });
  }
}

export const authController = new AuthController();
export default authController;
