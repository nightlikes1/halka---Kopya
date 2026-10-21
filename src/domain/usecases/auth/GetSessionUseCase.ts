import { IAuthRepository, AuthSession } from '@/domain/repositories/IAuthRepository';

export class GetSessionUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(): Promise<AuthSession | null> {
    return this.authRepo.getSession();
  }
}
