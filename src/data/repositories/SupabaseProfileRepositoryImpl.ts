import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '@/domain/entities/Widget';
import { ProfileRepository } from '@/domain/repositories/ProfileRepository';
import { DEFAULT_PROFILE } from '@/constants/widgets';
import { isSupabaseConfigured } from '@/core/supabase';
import { readJson, writeJson } from '../storage/jsonStore';

const PROFILE_KEY = 'halka:profile';

export class SupabaseProfileRepositoryImpl implements ProfileRepository {
  constructor(private client: SupabaseClient) {}

  private async getUserId(): Promise<string | null> {
    if (!isSupabaseConfigured) return null;
    const { data: { session } } = await this.client.auth.getSession();
    return session?.user?.id || null;
  }

  async getProfile(): Promise<UserProfile> {
    const userId = await this.getUserId();
    const storageKey = userId ? `halka:profile:${userId}` : PROFILE_KEY;

    if (userId) {
      try {
        const { data, error } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          const profile: UserProfile = {
            name: data.name || DEFAULT_PROFILE.name,
            title: data.title || DEFAULT_PROFILE.title,
            theme: data.theme || DEFAULT_PROFILE.theme,
            viewMode: data.view_mode || DEFAULT_PROFILE.viewMode,
            soundEnabled: data.sound_enabled ?? DEFAULT_PROFILE.soundEnabled,
            lastActiveDate: data.last_active_date || DEFAULT_PROFILE.lastActiveDate,
          };
          await writeJson(storageKey, profile);
          return profile;
        }
      } catch (err) {
        console.warn('Supabase getProfile fallback to local', err);
      }
    }

    const stored = await readJson<UserProfile>(storageKey, DEFAULT_PROFILE);
    return { ...DEFAULT_PROFILE, ...stored };
  }

  async saveProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...profile };
    const userId = await this.getUserId();
    const storageKey = userId ? `halka:profile:${userId}` : PROFILE_KEY;
    await writeJson(storageKey, updated);

    if (userId) {
      try {
        const payload: Record<string, unknown> = { id: userId };
        if (profile.name !== undefined) payload.name = profile.name;
        if (profile.title !== undefined) payload.title = profile.title;
        if (profile.theme !== undefined) payload.theme = profile.theme;
        if (profile.viewMode !== undefined) payload.view_mode = profile.viewMode;
        if (profile.soundEnabled !== undefined) payload.sound_enabled = profile.soundEnabled;
        if (profile.lastActiveDate !== undefined) payload.last_active_date = profile.lastActiveDate;

        await this.client
          .from('profiles')
          .upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase saveProfile sync error', err);
      }
    }

    return updated;
  }
}
