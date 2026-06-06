import { Prisma, User } from '@prisma/client';
export declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
}
export declare const userRepository: UserRepository;
export default userRepository;
