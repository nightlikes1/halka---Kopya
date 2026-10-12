import { User } from '../entities/User';

export interface UserRepository {
  getUserById(id: string): Promise<User | null>;
  createUser(name: string, email: string): Promise<User>;
}
