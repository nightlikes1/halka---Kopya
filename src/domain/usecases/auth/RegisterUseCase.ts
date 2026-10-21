import { IAuthRepository, RegisterCredentials, AuthSession } from '@/domain/repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthSession> {
    if (!credentials.name || credentials.name.trim().length < 2) {
      throw new Error('Lütfen en az 2 karakterden oluşan bir ad girin.');
    }
    if (!credentials.email || !credentials.email.includes('@')) {
      throw new Error('Lütfen geçerli bir e-posta adresi girin.');
    }
    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Şifreniz en az 6 karakter olmalıdır.');
    }
    return this.authRepo.signUp(credentials);
  }
}
