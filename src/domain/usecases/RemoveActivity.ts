import { ActivityRepository } from '../repositories/ActivityRepository';
import { EntryRepository } from '../repositories/EntryRepository';

export class RemoveActivity {
  constructor(private activities: ActivityRepository, private entries: EntryRepository) {}

  async execute(id: string): Promise<void> {
    await this.entries.removeByActivity(id);
    await this.activities.remove(id);
  }
}
