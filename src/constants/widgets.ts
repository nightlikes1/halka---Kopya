import { WidgetCatalogItem, WidgetsData, UserProfile } from '@/domain/entities/Widget';

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    id: 'water',
    name: 'Su Takibi',
    category: 'Sağlık',
    icon: '💧',
    desc: 'Günlük su tüketim hedefini belirle ve tek tıkla bardak ekle.',
    accent: '#38bdf8'
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Odak',
    category: 'Üretkenlik',
    icon: '⏱️',
    desc: '25 dakikalık derin odaklanma seansları ve mola zamanlayıcısı.',
    accent: '#f43f5e'
  },
  {
    id: 'tasks',
    name: 'Günlük Görevler',
    category: 'Üretkenlik',
    icon: '✅',
    desc: 'Bugünün öncelikli yapılacaklar listesi ve ilerleme çubuğu.',
    accent: '#10b981'
  },
  {
    id: 'streak',
    name: 'Zinciri Kırma',
    category: 'Alışkanlık',
    icon: '⛓️',
    desc: 'Her gün tekrarlanan alışkanlıkların ardışık gün zinciri.',
    accent: '#f59e0b'
  },
  {
    id: 'notes',
    name: 'Hızlı Not Defteri',
    category: 'Düşünce',
    icon: '📝',
    desc: 'Aklına gelen fikirleri anında kaydet, otomatik saklanır.',
    accent: '#8b5cf6'
  },
  {
    id: 'breathing',
    name: 'Kutu Nefesi (Zen)',
    category: 'Sağlık & Zihin',
    icon: '🧘',
    desc: '4-4-4-4 nefes döngüsüyle kalp ritmini düzenle ve sakinleş.',
    accent: '#06b6d4'
  },
  {
    id: 'mood',
    name: 'Ruh Hali & Enerji',
    category: 'Farkındalık',
    icon: '🌟',
    desc: 'Günün duygu durumunu ve enerji seviyeni kaydet.',
    accent: '#ec4899'
  },
  {
    id: 'ambient',
    name: 'Ortam Sesleri',
    category: 'Odak',
    icon: '🎧',
    desc: 'Sentezlenmiş yağmur, uzay ve kafe sesleriyle odaklan.',
    accent: '#6366f1'
  },
  {
    id: 'bigOne',
    name: 'Günün Ana Hedefi',
    category: 'Odak',
    icon: '🎯',
    desc: 'Bugün ne olursa olsun bitirilmesi gereken 1 numaralı görev.',
    accent: '#eab308'
  },
  {
    id: 'budget',
    name: 'Günlük Harcama',
    category: 'Finans',
    icon: '💰',
    desc: 'Günün harcama limitini ve anlık harcamalarını takip et.',
    accent: '#14b8a6'
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Kullanıcı',
  title: 'Kişisel Hayat Yöneticisi',
  theme: 'cyber-cyan',
  viewMode: 'cockpit',
  soundEnabled: true,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export const DEFAULT_WIDGETS_DATA: WidgetsData = {
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
};

export const DEFAULT_ACTIVE_WIDGET_IDS: string[] = [];
