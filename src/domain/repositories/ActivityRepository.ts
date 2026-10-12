import { Activity } from '../entities/Activity';

export interface ActivityRepository {
  getAll(): Promise<Activity[]>;
  save(activity: Activity): Promise<void>;
  remove(id: string): Promise<void>;
}
