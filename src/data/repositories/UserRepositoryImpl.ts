import { User } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { readJson, writeJson } from '../storage/jsonStore';

const KEY = 'halka:user';

export class UserRepositoryImpl implements UserRepository {
  async getUserById(id: string): Promise<User | null> {
    const users = await readJson<User[]>(KEY, [
      { id: '1', name: 'Caner', email: 'caner@halka.com', points: 150 },
      { id: '2', name: 'Burak', email: 'burak@halka.com', points: 90 },
    ]);
    const found = users.find((u) => u.id === id);
    return found || null;
  }

  async createUser(name: string, email: string): Promise<User> {
    const users = await readJson<User[]>(KEY, []);
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      points: 0,
    };
    users.push(newUser);
    await writeJson(KEY, users);
    return newUser;
  }
}
