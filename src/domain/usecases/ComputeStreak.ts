import { addDays, toKey } from '@/core/date';
import { Activity } from '../entities/Activity';
import { Entry } from '../entities/Entry';

/**
 * Esnek seri: bir gün sayılması için en az bir "yapmak istediğim" kaydı gerekir.
 * Her 7 günlük pencerede 1 boş gün (joker) seriyi bozmaz. Bugün henüz boşsa seri bozulmaz.
 */
export function computeStreak(activities: Activity[], entries: Entry[], today: Date = new Date()): number {
  const buildIds = new Set(activities.filter((a) => a.kind === 'build').map((a) => a.id));
  const active = new Set(entries.filter((e) => buildIds.has(e.activityId) && e.value > 0).map((e) => e.date));

  let streak = 0;
  let lastMiss = -99;
  let i = active.has(toKey(today)) ? 0 : 1;
  for (; i < 400; i++) {
    if (active.has(toKey(addDays(today, -i)))) {
      streak++;
      continue;
    }
    if (i - lastMiss <= 6) break;
    lastMiss = i;
  }
  return streak;
}
