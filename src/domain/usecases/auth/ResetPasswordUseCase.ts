import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class ResetPasswordUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Şifre sıfırlama bağlantısı için geçerli bir e-posta girin.');
    }
    return this.authRepo.resetPassword(email);
  }
}
