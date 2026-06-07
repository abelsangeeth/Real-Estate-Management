import { User, UserCreateInput } from '../types/models';
import { mockUsers, initMockDb } from '../utils/mockDb';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    await initMockDb();
    const user = mockUsers.find((u) => u.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    await initMockDb();
    const user = mockUsers.find((u) => u.id === id);
    return user || null;
  }

  async create(data: UserCreateInput): Promise<User> {
    await initMockDb();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || 'buyer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  }
}

export const userRepository = new UserRepository();
export default userRepository;
