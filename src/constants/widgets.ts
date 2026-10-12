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
};

export const DEFAULT_ACTIVE_WIDGET_IDS = ['water', 'pomodoro', 'tasks', 'streak'];
