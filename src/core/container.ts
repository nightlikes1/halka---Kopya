import { supabase } from './supabase';
import { SupabaseAuthRepositoryImpl } from '@/data/repositories/SupabaseAuthRepositoryImpl';
import { SupabaseWidgetRepositoryImpl } from '@/data/repositories/SupabaseWidgetRepositoryImpl';
import { SupabaseProfileRepositoryImpl } from '@/data/repositories/SupabaseProfileRepositoryImpl';

import { LoginUseCase } from '@/domain/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@/domain/usecases/auth/RegisterUseCase';
import { ResetPasswordUseCase } from '@/domain/usecases/auth/ResetPasswordUseCase';
import { UpdatePasswordUseCase } from '@/domain/usecases/auth/UpdatePasswordUseCase';
import { LogoutUseCase } from '@/domain/usecases/auth/LogoutUseCase';
import { GetSessionUseCase } from '@/domain/usecases/auth/GetSessionUseCase';

import { GenerateBriefing } from '@/domain/usecases/GenerateBriefing';
import { LoadData } from '@/domain/usecases/LoadData';
import { ToggleWidgetActive } from '@/domain/usecases/ToggleWidgetActive';
import { UpdateProfile } from '@/domain/usecases/UpdateProfile';
import { UpdateWidgetData } from '@/domain/usecases/UpdateWidgetData';

import { sound } from './audio';
import * as motion from './motion';

// Repositories (Supabase + Local-First Fallback)
const authRepo = new SupabaseAuthRepositoryImpl(supabase);
const widgetRepo = new SupabaseWidgetRepositoryImpl(supabase);
const profileRepo = new SupabaseProfileRepositoryImpl(supabase);

// Auth Use Cases
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);
const resetPasswordUseCase = new ResetPasswordUseCase(authRepo);
const updatePasswordUseCase = new UpdatePasswordUseCase(authRepo);
const logoutUseCase = new LogoutUseCase(authRepo);
const getSessionUseCase = new GetSessionUseCase(authRepo);

// Domain Use Cases
const loadData = new LoadData(
  { getAll: async () => [], save: async () => {}, remove: async () => {} },
  { getAll: async () => [], add: async () => {}, removeLast: async () => {}, removeByActivity: async () => {} },
  widgetRepo,
  profileRepo
);
const updateWidgetData = new UpdateWidgetData(widgetRepo);
const toggleWidgetActive = new ToggleWidgetActive(widgetRepo);
const updateProfile = new UpdateProfile(profileRepo);
const generateBriefing = new GenerateBriefing();

/**
 * Clean Architecture Merkezi Bağımlılık Enjeksiyonu (DI) Konteyneri
 */
export const container = {
  // Client
  supabase,

  // Repositories
  authRepo,
  widgetRepo,
  profileRepo,

  // Auth Use Cases
  loginUseCase,
  registerUseCase,
  resetPasswordUseCase,
  updatePasswordUseCase,
  logoutUseCase,
  getSessionUseCase,

  // Domain Use Cases
  loadData,
  updateWidgetData,
  toggleWidgetActive,
  updateProfile,
  generateBriefing,

  // Core Services
  sound,
  motion,
};
