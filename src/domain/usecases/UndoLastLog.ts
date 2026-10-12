import { toKey } from '@/core/date';
import { EntryRepository } from '../repositories/EntryRepository';

export class UndoLastLog {
  constructor(private repo: EntryRepository) {}

  execute(activityId: string): Promise<void> {
    return this.repo.removeLast(activityId, toKey());
  }
}
