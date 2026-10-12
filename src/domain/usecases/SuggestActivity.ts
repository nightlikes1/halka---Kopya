import { Activity } from '../entities/Activity';

export type Mood = 'tired' | 'ok' | 'energetic';

const fits = (a: Activity, minutes: number) => (a.goalType === 'duration' ? a.goalValue <= minutes : true);

/** Boş vakit modu: süreye sığan, ruh haline uygun bir hobi seçer. */
export function suggestActivity(
  activities: Activity[],
  minutes: number,
  mood: Mood,
  excludeId?: string,
): Activity | null {
  const pool = activities.filter((a) => a.kind === 'build' && a.id !== excludeId && fits(a, minutes));
  if (pool.length === 0) return null;

  const scored = pool.map((a) => {
    let s = Math.random() * 2;
    if (mood === 'energetic') s += a.weight;
    else if (mood === 'tired') s += a.goalType === 'duration' && a.goalValue > 20 ? -2 : 1;
    else s += a.weight * 0.5;
    return { a, s };
  });
  return scored.sort((x, y) => y.s - x.s)[0].a;
}
