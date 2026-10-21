import { IAuthRepository, LoginCredentials, AuthSession } from '@/domain/repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    if (!credentials.email || !credentials.email.includes('@')) {
      throw new Error('Lütfen geçerli bir e-posta adresi girin.');
    }
    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır.');
    }
    return this.authRepo.signIn(credentials);
  }
}
