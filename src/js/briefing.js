// Dynamic Life OS Briefing & Center Ring Status Generator
import { container } from '../core/container';

export function getGreetingTime() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Günaydın';
  if (hour >= 12 && hour < 18) return 'Tünaydın';
  if (hour >= 18 && hour < 22) return 'İyi akşamlar';
  return 'İyi geceler';
}

export function formatTurkishDate() {
  const now = new Date();
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dayNum = now.getDate();
  const year = now.getFullYear();

  return `${dayNum} ${monthName} ${year}, ${dayName}`;
}

export function generateDailyBriefing(storageManager) {
  const profile = storageManager.getProfile();
  const activeIds = storageManager.getActiveWidgetIds();
  const widgetsData = storageManager.data.widgetsData;

  // Domain Use Case: GenerateBriefing
  const briefingResult = container.generateBriefing.execute(profile, activeIds, widgetsData);

  return {
    greeting: briefingResult.greeting,
    dateStr: formatTurkishDate(),
    activeCount: activeIds.length,
    summaryText: briefingResult.statusText,
    metrics: briefingResult.metrics.map(m => ({
      icon: m.icon,
      label: m.label,
      value: m.value,
      pct: 100
    }))
  };
}
