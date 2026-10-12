import { uid } from '@/core/id';
import { Activity } from '../entities/Activity';
import { ActivityRepository } from '../repositories/ActivityRepository';

export type NewActivity = Omit<Activity, 'id' | 'createdAt'>;

export class AddActivity {
  constructor(private repo: ActivityRepository) {}

  async execute(input: NewActivity): Promise<Activity> {
    const name = input.name.trim();
    if (!name) throw new Error('Bir isim yaz.');

    let goalValue = Math.max(1, input.goalValue);
    if (input.goalType === 'avoid') goalValue = 0;
    if (input.goalType === 'yesno') goalValue = 1;

    const activity: Activity = {
      ...input,
      name,
      goalValue,
      id: uid(),
      createdAt: new Date().toISOString(),
    };
    await this.repo.save(activity);
    return activity;
  }
}
