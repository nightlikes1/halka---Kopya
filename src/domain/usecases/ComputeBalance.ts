import { Activity } from '../entities/Activity';
import { Entry } from '../entities/Entry';

export interface Balance {
  healthy: number;
  cheap: number;
  /** 0-100: sağlıklı dopaminin toplam içindeki payı. Kayıt yoksa null. */
  score: number | null;
}

/** Aktivitenin kaydını "dakika eşdeğerine" çevirir (adet = 10 dk, evet/hayır = 15 dk). */
const toUnits = (a: Activity, value: number): number => {
  if (a.goalType === 'duration') return value;
  if (a.goalType === 'count') return value * 10;
  return 15;
};

export function computeBalance(activities: Activity[], entries: Entry[]): Balance {
  const byId = new Map(activities.map((a) => [a.id, a]));
  let healthy = 0;
  let cheap = 0;
  for (const e of entries) {
    const a = byId.get(e.activityId);
    if (!a) continue;
    const pts = toUnits(a, e.value) * a.weight;
    if (a.kind === 'build') healthy += pts;
    else cheap += pts;
  }
  const total = healthy + cheap;
  return { healthy, cheap, score: total === 0 ? null : Math.round((healthy / total) * 100) };
}
