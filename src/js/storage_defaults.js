export const DEFAULT_DATA = {
  profile: {
    name: 'Kullanıcı',
    title: 'Kişisel Hayat Yöneticisi',
    theme: 'cyber-cyan',
    viewMode: 'cockpit',
    soundEnabled: true,
    lastActiveDate: new Date().toISOString().split('T')[0]
  },
  activeWidgetIds: [],
  widgetsData: {
    water: {
      current: 0,
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
      completedSessions: 0
    },
    tasks: {
      items: []
    },
    streak: {
      habitName: 'Günlük Odak & Alışkanlık',
      currentStreak: 0,
      bestStreak: 0,
      lastCheckedDate: '',
      history: []
    },
    notes: {
      content: ''
    },
    breathing: {
      cyclesCompleted: 0,
      currentPhase: 'idle'
    },
    mood: {
      todayMood: 'calm',
      energyLevel: 5,
      reflection: ''
    },
    ambient: {
      soundType: 'none',
      volume: 0.5
    },
    bigOne: {
      goal: '',
      isCompleted: false,
      category: 'Odak'
    },
    budget: {
      limit: 500,
      spent: 0,
      items: []
    }
  }
};

