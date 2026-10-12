export const DEFAULT_DATA = {
  profile: {
    name: 'Kullanıcı',
    title: 'Kişisel Hayat Yöneticisi',
    theme: 'cyber-cyan',
    viewMode: 'cockpit',
    soundEnabled: true,
    lastActiveDate: new Date().toISOString().split('T')[0]
  },
  activeWidgetIds: ['water', 'pomodoro', 'tasks', 'streak'],
  widgetsData: {
    water: {
      current: 1250,
      target: 2500,
      step: 250,
      history: []
    },
    pomodoro: {
      mode: 'work',
      timeLeft: 25 * 60,
      isRunning: false,
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      completedSessions: 2
    },
    tasks: {
      items: [
        { id: 't1', text: 'Halka sistemini kişiselleştir', done: true, priority: 'high' },
        { id: 't2', text: 'Önemli projeye 45 dakika odaklan', done: false, priority: 'high' },
        { id: 't3', text: 'Kitap oku ve not al (20 dk)', done: false, priority: 'normal' }
      ]
    },
    streak: {
      habitName: 'Günlük Odak & Gelişim',
      currentStreak: 5,
      bestStreak: 14,
      lastCheckedDate: new Date().toISOString().split('T')[0],
      history: [true, true, true, true, true, false, true]
    },
    notes: {
      content: '📌 Bugünün İlhamı: "Küçük adımların zinciri, büyük dönüşümlerin halkasıdır."\n- Odaklanmayı dağıtan bildirimleri kapat.\n- Akşam yürüyüşü yap.'
    },
    breathing: {
      cyclesCompleted: 3,
      currentPhase: 'idle'
    },
    mood: {
      todayMood: 'energetic',
      energyLevel: 8,
      reflection: 'Enerjim yerinde, zihnim berrak.'
    },
    ambient: {
      soundType: 'none',
      volume: 0.5
    },
    bigOne: {
      goal: 'Önemli web arayüzünü tamamla',
      isCompleted: false,
      category: 'Kariyer'
    },
    budget: {
      limit: 500,
      spent: 120,
      items: [
        { id: 'b1', name: 'Kahve & Atıştırmalık', amount: 120 }
      ]
    }
  }
};
