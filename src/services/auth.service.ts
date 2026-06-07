import bcrypt from 'bcryptjs';
import userRepository from '../repositories/user.repository';
import { AppError } from '../middleware/error.middleware';
import { User, UserCreateInput } from '../types/models';

export class AuthService {
  async register(data: UserCreateInput): Promise<Omit<User, 'password'>> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, 'A user with this email already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, passwordPlain: string): Promise<Omit<User, 'password'>> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password credentials.');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) {
      throw new AppError(401, 'Invalid email or password credentials.');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found.');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
export default authService;
