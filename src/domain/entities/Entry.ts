export interface Entry {
  id: string;
  activityId: string;
  /** YYYY-MM-DD */
  date: string;
  /** dakika, adet ya da 1 (evet/hayır ve avoid için) */
  value: number;
  note?: string;
  createdAt: string;
}
