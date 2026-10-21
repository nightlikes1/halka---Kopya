import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class UpdatePasswordUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(newPassword: string): Promise<void> {
    if (!newPassword || newPassword.trim().length < 6) {
      throw new Error('Yeni şifre en az 6 karakter olmalıdır.');
    }
    await this.authRepo.updatePassword(newPassword.trim());
  }
}
