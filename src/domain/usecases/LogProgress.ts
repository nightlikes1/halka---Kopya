import { toKey } from '@/core/date';
import { uid } from '@/core/id';
import { Entry } from '../entities/Entry';
import { EntryRepository } from '../repositories/EntryRepository';

export class LogProgress {
  constructor(private repo: EntryRepository) {}

  async execute(activityId: string, value: number, note?: string): Promise<Entry> {
    if (value <= 0) throw new Error('Değer sıfırdan büyük olmalı.');
    const entry: Entry = {
      id: uid(),
      activityId,
      date: toKey(),
      value,
      note,
      createdAt: new Date().toISOString(),
    };
    await this.repo.add(entry);
    return entry;
  }
}
