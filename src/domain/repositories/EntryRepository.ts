import { Entry } from '../entities/Entry';

export interface EntryRepository {
  getAll(): Promise<Entry[]>;
  add(entry: Entry): Promise<void>;
  /** Verilen gündeki son kaydı siler (yanlış dokunuşu geri al). */
  removeLast(activityId: string, date: string): Promise<void>;
  removeByActivity(activityId: string): Promise<void>;
}
