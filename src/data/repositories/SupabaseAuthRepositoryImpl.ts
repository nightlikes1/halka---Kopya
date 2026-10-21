import { SupabaseClient } from '@supabase/supabase-js';
import {
  IAuthRepository,
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthStateChangeCallback,
} from '@/domain/repositories/IAuthRepository';
import { isSupabaseConfigured } from '@/core/supabase';

const LOCAL_SESSION_KEY = 'halka:local_auth_session';
const LOCAL_USERS_KEY = 'halka:local_users_db';

export class SupabaseAuthRepositoryImpl implements IAuthRepository {
  private listeners: AuthStateChangeCallback[] = [];

  constructor(private client: SupabaseClient) {
    if (isSupabaseConfigured) {
      this.client.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          const authSession = this.mapSession(session, session.user);
          this.notifyListeners(authSession, event);
        } else {
          this.notifyListeners(null, event);
        }
      });
    }
  }

  async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    if (isSupabaseConfigured) {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (error || !data.session || !data.user) {
        throw new Error(this.mapAuthError(error?.message || 'Giriş yapılamadı.'));
      }

      return this.mapSession(data.session, data.user);
    }

    // Yerel Mod (Local / Offline Fallback)
    const users = this.getLocalUsers();
    const existing = users.find(u => u.email.toLowerCase() === credentials.email.trim().toLowerCase());
    
    if (!existing) {
      // Kolay başlangıç: Eğer yerel kullanıcı henüz yoksa otomatik oluştur veya şifre kontrolü yap
      const role: 'admin' | 'user' = credentials.email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const newSession: AuthSession = {
        accessToken: 'local-token-' + Date.now(),
        user: {
          id: 'user-' + Date.now(),
          email: credentials.email.trim(),
          name: credentials.email.split('@')[0],
          role,
        },
      };
      this.saveLocalSession(newSession);
      this.notifyListeners(newSession);
      return newSession;
    }

    if (existing.password !== credentials.password) {
      throw new Error('Geçersiz e-posta veya şifre girdiniz.');
    }

    const role: 'admin' | 'user' = credentials.email.toLowerCase().includes('admin') ? 'admin' : (existing.role || 'user');
    const session: AuthSession = {
      accessToken: 'local-token-' + Date.now(),
      user: {
        id: existing.id,
        email: existing.email,
        name: existing.name,
        role,
      },
    };
    this.saveLocalSession(session);
    this.notifyListeners(session);
    return session;
  }

  async signUp(credentials: RegisterCredentials): Promise<AuthSession> {
    if (isSupabaseConfigured) {
      const { data, error } = await this.client.auth.signUp({
        email: credentials.email.trim(),
        password: credentials.password,
        options: {
          data: {
            name: credentials.name.trim(),
          },
        },
      });

      if (error) {
        throw new Error(this.mapAuthError(error.message));
      }

      // Supabase Email Enumeration Koruması:
      // Kullanıcı zaten varsa error dönmez, identities dizisi boş [] döner
      if (data.user?.identities && data.user.identities.length === 0) {
        throw new Error('Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen giriş yapın.');
      }

      if (!data.session && data.user) {
        // Supabase yeni kayıt için e-posta onayı gerektiriyorsa
        throw new Error('Kayıt başarılı! Lütfen e-posta kutunuza gelen onay linkine tıklayın.');
      }

      return this.mapSession(data.session, data.user!);
    }

    // Yerel Mod (Local / Offline Fallback)
    const users = this.getLocalUsers();
    const email = credentials.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === email)) {
      throw new Error('Bu e-posta adresiyle kayıtlı bir hesap zaten var.');
    }

    const newUser = {
      id: 'local-user-' + Date.now(),
      email: credentials.email.trim(),
      name: credentials.name.trim() || credentials.email.split('@')[0],
      password: credentials.password,
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    const session: AuthSession = {
      accessToken: 'local-token-' + Date.now(),
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
    this.saveLocalSession(session);
    this.notifyListeners(session);
    return session;
  }

  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      await this.client.auth.signOut();
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    this.notifyListeners(null);
  }

  async resetPassword(email: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await this.client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) {
        throw new Error(this.mapAuthError(error.message));
      }
      return;
    }

    // Yerel modda simüle et
    await new Promise(r => setTimeout(r, 600));
  }

  async updatePassword(newPassword: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        throw new Error(this.mapAuthError(error.message));
      }
      return;
    }

    // Yerel mod fallback
    const current = await this.getSession();
    if (current?.user) {
      const users = this.getLocalUsers();
      const u = users.find(item => item.id === current.user.id || item.email.toLowerCase() === current.user.email.toLowerCase());
      if (u) {
        u.password = newPassword;
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }
    }
  }

  async getSession(): Promise<AuthSession | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await this.client.auth.getSession();
      if (!error && data.session && data.session.user) {
        return this.mapSession(data.session, data.session.user);
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      if (raw) return JSON.parse(raw) as AuthSession;
    } catch {
      // ignore
    }
    return null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const session = await this.getSession();
    return session ? session.user : null;
  }

  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(session: AuthSession | null, event?: string): void {
    this.listeners.forEach(l => l(session, event));
  }

  private mapSession(session: any, user: any): AuthSession {
    const role: 'admin' | 'user' = (user.user_metadata?.role as 'admin' | 'user') || 
      (user.email?.toLowerCase().includes('admin') ? 'admin' : 'user');
    return {
      accessToken: session.access_token || '',
      expiresAt: session.expires_at,
      user: {
        id: user.id,
        email: user.email || '',
        name: (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'Kullanıcı',
        role,
      },
    };
  }

  private mapAuthError(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
      return 'Geçersiz e-posta veya şifre girdiniz.';
    }
    if (lower.includes('user already registered') || lower.includes('unique constraint')) {
      return 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.';
    }
    if (lower.includes('password should be at least')) {
      return 'Şifre en az 6 karakter olmalıdır.';
    }
    if (lower.includes('rate limit')) {
      return 'Çok fazla istek yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
    }
    return msg;
  }

  private getLocalUsers(): any[] {
    try {
      const raw = localStorage.getItem(LOCAL_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalSession(session: AuthSession): void {
    try {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
  }
}
