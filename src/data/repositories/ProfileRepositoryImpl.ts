import { UserProfile } from '@/domain/entities/Widget';
import { ProfileRepository } from '@/domain/repositories/ProfileRepository';
import { DEFAULT_PROFILE } from '@/constants/widgets';
import { readJson, writeJson } from '../storage/jsonStore';

const PROFILE_KEY = 'halka:profile';

export class ProfileRepositoryImpl implements ProfileRepository {
  async getProfile(): Promise<UserProfile> {
    const stored = await readJson<UserProfile>(PROFILE_KEY, DEFAULT_PROFILE);
    return { ...DEFAULT_PROFILE, ...stored };
  }

  async saveProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...profile };
    await writeJson(PROFILE_KEY, updated);
    return updated;
  }
}
