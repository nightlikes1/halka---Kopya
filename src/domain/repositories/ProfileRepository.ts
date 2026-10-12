import { UserProfile } from '../entities/Widget';

export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  saveProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
}
