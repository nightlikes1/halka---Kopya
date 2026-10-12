export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn(`Halka Storage: Failed to read key "${key}"`, err);
    return fallback;
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Halka Storage: Failed to write key "${key}"`, err);
  }
}
