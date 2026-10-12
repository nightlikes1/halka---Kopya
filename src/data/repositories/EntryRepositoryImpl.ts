import { Entry } from '@/domain/entities/Entry';
import { EntryRepository } from '@/domain/repositories/EntryRepository';
import { readJson, writeJson } from '../storage/jsonStore';

const KEY = 'halka:entries';

export class EntryRepositoryImpl implements EntryRepository {
  getAll(): Promise<Entry[]> {
    return readJson<Entry[]>(KEY, []);
  }

  async add(entry: Entry): Promise<void> {
    const all = await this.getAll();
    all.push(entry);
    await writeJson(KEY, all);
  }

  async removeLast(activityId: string, date: string): Promise<void> {
    const all = await this.getAll();
    for (let i = all.length - 1; i >= 0; i--) {
      if (all[i].activityId === activityId && all[i].date === date) {
        all.splice(i, 1);
        break;
      }
    }
    await writeJson(KEY, all);
  }

  async removeByActivity(activityId: string): Promise<void> {
    const all = await this.getAll();
    await writeJson(KEY, all.filter((e) => e.activityId !== activityId));
  }
}
