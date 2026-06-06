import { Prisma, User } from '@prisma/client';
export declare class AuthService {
    register(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>>;
    login(email: string, passwordPlain: string): Promise<Omit<User, 'password'>>;
    getUserById(id: string): Promise<Omit<User, 'password'>>;
}
export declare const authService: AuthService;
export default authService;
