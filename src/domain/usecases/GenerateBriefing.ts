import { getTurkishGreeting } from '@/core/date';
import { DailyBriefing, BriefingMetric } from '../entities/Briefing';
import { UserProfile, WidgetsData } from '../entities/Widget';

export class GenerateBriefing {
  execute(
    profile: UserProfile,
    activeIds: string[],
    widgetsData: WidgetsData,
  ): DailyBriefing {
    const greetingTime = getTurkishGreeting();
    const name = profile.name || 'Dostum';
    const metrics: BriefingMetric[] = [];
    const insights: string[] = [];

    // 1. Water metric
    if (activeIds.includes('water') && widgetsData.water) {
      const { current, target } = widgetsData.water;
      const pct = Math.min(100, Math.round((current / (target || 2000)) * 100));
      metrics.push({
        icon: '💧',
        label: 'Su',
        value: `${current} / ${target} ml`,
      });
      if (pct >= 100) {
        insights.push('Günlük su hedefine ulaştın! 💦');
      } else if (pct >= 50) {
        insights.push(`Su hedefinin %${pct}'si tamamlandı.`);
      } else {
        insights.push(`Bir bardak su ile enerjini tazele (%${pct}).`);
      }
    }

    // 2. Pomodoro metric
    if (activeIds.includes('pomodoro') && widgetsData.pomodoro) {
      const { completedSessions } = widgetsData.pomodoro;
      metrics.push({
        icon: '⏱️',
        label: 'Odak',
        value: `${completedSessions} Oturum`,
      });
      if (completedSessions > 0) {
        insights.push(`${completedSessions} derin odak seansı tamamlandı.`);
      }
    }

    // 3. Tasks metric
    if (activeIds.includes('tasks') && widgetsData.tasks) {
      const items = widgetsData.tasks.items || [];
      const done = items.filter((t) => t.done).length;
      const total = items.length;
      metrics.push({
        icon: '✅',
        label: 'Görevler',
        value: `${done}/${total}`,
      });
      if (total === 0) {
        insights.push('Henüz görev listesi boş, yeni hedefler belirleyebilirsin.');
      } else if (done === total) {
        insights.push('Tüm günlük görevlerin bitti, harikasın! 🎉');
      } else {
        insights.push(`${total - done} görev tamamlanmayı bekliyor.`);
      }
    }

    // 4. Streak metric
    if (activeIds.includes('streak') && widgetsData.streak) {
      const { currentStreak, habitName } = widgetsData.streak;
      metrics.push({
        icon: '🔥',
        label: 'Zincir',
        value: `${currentStreak} Gün`,
      });
      insights.push(`"${habitName}" zincirin ${currentStreak} gündür kırılmadı! ⛓️`);
    }

    // 5. Big One metric
    if (activeIds.includes('bigOne') && widgetsData.bigOne) {
      const { goal, isCompleted } = widgetsData.bigOne;
      if (goal) {
        if (isCompleted) {
          insights.push(`Günün ana hedefi ("${goal}") başarıyla tamamlandı! 🌟`);
        } else {
          insights.push(`Günün ana odağı: "${goal}"`);
        }
      }
    }

    let statusText = '';
    if (insights.length > 0) {
      statusText = insights.slice(0, 2).join(' ') + ' Halkanın tüm döngüleri dengeli işliyor.';
    } else {
      statusText = 'Bugün etrafına ekleyeceğin eklentilerle kişisel ritmini kurabilirsin. Halka hazır!';
    }

    return {
      greeting: `${greetingTime}, ${name}`,
      statusText,
      activeCountText: `${activeIds.length} Aktif Eklenti`,
      metrics,
    };
  }
}
