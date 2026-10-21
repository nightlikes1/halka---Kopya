import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class LogoutUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepo.signOut();
  }
}
