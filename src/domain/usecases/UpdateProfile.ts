import { UserProfile } from '../entities/Widget';
import { ProfileRepository } from '../repositories/ProfileRepository';

export class UpdateProfile {
  constructor(private repo: ProfileRepository) {}

  async execute(profile: Partial<UserProfile>): Promise<UserProfile> {
    return this.repo.saveProfile(profile);
  }
}
