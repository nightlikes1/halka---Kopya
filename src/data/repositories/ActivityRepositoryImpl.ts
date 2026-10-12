import { Activity } from '@/domain/entities/Activity';
import { ActivityRepository } from '@/domain/repositories/ActivityRepository';
import { readJson, writeJson } from '../storage/jsonStore';

const KEY = 'halka:activities';

export class ActivityRepositoryImpl implements ActivityRepository {
  getAll(): Promise<Activity[]> {
    return readJson<Activity[]>(KEY, []);
  }

  async save(activity: Activity): Promise<void> {
    const all = await this.getAll();
    const i = all.findIndex((a) => a.id === activity.id);
    if (i >= 0) all[i] = activity;
    else all.push(activity);
    await writeJson(KEY, all);
  }

  async remove(id: string): Promise<void> {
    const all = await this.getAll();
    await writeJson(KEY, all.filter((a) => a.id !== id));
  }
}
