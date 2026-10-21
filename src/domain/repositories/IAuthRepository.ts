export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
  expiresAt?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export type AuthStateChangeCallback = (session: AuthSession | null, event?: string) => void;

export interface IAuthRepository {
  signIn(credentials: LoginCredentials): Promise<AuthSession>;
  signUp(credentials: RegisterCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChange(callback: AuthStateChangeCallback): () => void;
}
