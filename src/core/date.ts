export const toKey = (d: Date = new Date()): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const addDays = (d: Date, n: number): Date => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

/** Bugün dahil son n günün anahtarları (eskiden yeniye). */
export const lastDays = (n: number, from: Date = new Date()): string[] =>
  Array.from({ length: n }, (_, i) => toKey(addDays(from, -(n - 1 - i))));

export const shortDay = (key: string): string =>
  ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][new Date(`${key}T12:00:00`).getDay()];

export const getTurkishGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Günaydın';
  if (hour >= 12 && hour < 18) return 'İyi günler';
  if (hour >= 18 && hour < 23) return 'İyi akşamlar';
  return 'İyi geceler';
};
