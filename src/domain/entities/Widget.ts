export type ThemeMode = 'cyber-cyan' | 'neon-violet' | 'gold-chain' | 'emerald-zen';
export type ViewMode = 'cockpit' | 'grid';
export type ActiveTab = 'cockpit' | 'today' | 'library' | 'explore';

export interface UserProfile {
  name: string;
  title: string;
  theme: ThemeMode;
  viewMode: ViewMode;
  activeTab?: ActiveTab;
  soundEnabled: boolean;
  lastActiveDate: string;
}

export interface WidgetCatalogItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  desc: string;
  accent: string;
}

export interface WaterData {
  current: number;
  target: number;
  step: number;
  history: { time: string; amount: number }[];
}

export interface PomodoroData {
  mode: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  isRunning: boolean;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  completedSessions: number;
}

export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  priority: 'high' | 'normal' | 'low';
}

export interface TasksData {
  items: TaskItem[];
}

export interface StreakData {
  habitName: string;
  currentStreak: number;
  bestStreak: number;
  lastCheckedDate: string;
  history: boolean[];
}

export interface NotesData {
  content: string;
}

export interface BreathingData {
  cyclesCompleted: number;
  currentPhase: 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest';
}

export interface MoodData {
  todayMood: 'great' | 'energetic' | 'calm' | 'tired' | 'low';
  energyLevel: number;
  reflection: string;
}

export interface AmbientData {
  soundType: 'none' | 'rain' | 'space' | 'pinkNoise';
  volume: number;
}

export interface BigOneData {
  goal: string;
  isCompleted: boolean;
  category: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
}

export interface BudgetData {
  limit: number;
  spent: number;
  items: BudgetItem[];
}

export interface WidgetsData {
  water: WaterData;
  pomodoro: PomodoroData;
  tasks: TasksData;
  streak: StreakData;
  notes: NotesData;
  breathing: BreathingData;
  mood: MoodData;
  ambient: AmbientData;
  bigOne: BigOneData;
  budget: BudgetData;
  [key: string]: unknown;
}
