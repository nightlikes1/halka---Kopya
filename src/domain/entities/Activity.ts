/** build: yapmak istediklerim (hobi) — reduce: azaltmak istediklerim (telefon, sigara...) */
export type ActivityKind = 'build' | 'reduce';

/** duration: dakika · count: adet · yesno: evet/hayır · avoid: "yapmama" hedefi */
export type GoalType = 'duration' | 'count' | 'yesno' | 'avoid';

export interface Activity {
  id: string;
  name: string;
  kind: ActivityKind;
  goalType: GoalType;
  /** build için günlük hedef, reduce için günlük üst sınır (avoid = 0) */
  goalValue: number;
  /** build: keyif puanı (1-5) · reduce: bağımlılık/zarar puanı (1-5) */
  weight: number;
  createdAt: string;
}
