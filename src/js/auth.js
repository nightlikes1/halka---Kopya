// In-Ring Authentication Controller (Login Ekranı Halka İçinde)
import { container } from '../core/container';

export class AuthController {
  constructor(onAuthSuccess) {
    this.onAuthSuccess = onAuthSuccess || (() => {});
    this.currentTab = 'login'; // 'login' | 'register' | 'forgot' | 'admin'
    this.authPane = document.getElementById('core-auth-view');
    this.ringWrapper = document.getElementById('central-ring-wrapper');
    this.mainCanvas = document.getElementById('halka-main-canvas');
    this.bindEvents();
  }

  bindEvents() {
    if (!this.authPane) {
      this.authPane = document.getElementById('core-auth-view');
    }
    if (!this.authPane) return;

    // In-Ring Tab geçiş butonları
    this.authPane.querySelectorAll('.ring-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        container.sound.playClick();
        this.switchTab(btn.dataset.tab);
      });
    });

    // Şifremi unuttum tetikleyicisi
    const forgotBtn = document.getElementById('btn-ring-show-forgot');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        container.sound.playClick();
        this.switchTab('forgot');
      });
    }

    const backBtn = document.getElementById('btn-ring-back-to-login');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        container.sound.playClick();
        this.switchTab('login');
      });
    }

    // 1. Hızlı Demo Girişi
    const quickDemoBtn = document.getElementById('btn-ring-quick-demo');
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', async () => {
        container.sound.playClick();
        await this.handleQuickDemo();
      });
    }

    // 2. Hızlı Panel / Admin Girişi
    const quickAdminBtn = document.getElementById('btn-ring-quick-admin');
    if (quickAdminBtn) {
      quickAdminBtn.addEventListener('click', async () => {
        container.sound.playClick();
        await this.handleQuickAdmin();
      });
    }

    // 3. Giriş Formu Submit
    document.getElementById('ring-form-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    // 4. Kayıt Formu Submit
    document.getElementById('ring-form-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });

    // 5. Şifre Sıfırla Submit
    document.getElementById('ring-form-forgot')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleResetPassword();
    });

    // 6. Panel Girişi Submit
    document.getElementById('ring-form-admin')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleAdminLogin();
    });

    // 7. Şifre Yenileme Formu İptal
    const cancelResetBtn = document.getElementById('btn-ring-cancel-reset');
    if (cancelResetBtn) {
      cancelResetBtn.addEventListener('click', () => {
        container.sound.playClick();
        this.switchTab('login');
      });
    }

    // 8. Yeni Şifre Belirleme Submit
    document.getElementById('ring-form-reset-password')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleUpdatePassword();
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.clearAlert();

    const tabsBar = document.getElementById('ring-auth-tabs');
    if (tabsBar) {
      tabsBar.style.display = (tab === 'forgot' || tab === 'reset-password') ? 'none' : 'flex';
      tabsBar.querySelectorAll('.ring-tab-btn').forEach((b) => {
        b.classList.toggle('active', b.dataset.tab === tab);
      });
    }

    this.authPane.querySelectorAll('.ring-auth-form-pane').forEach((p) => {
      p.classList.remove('active');
    });

    const target = document.getElementById(`ring-form-${tab}`);
    if (target) {
      target.classList.add('active');
      const firstInput = target.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 60);
    }
  }

  showAlert(message, type = 'error') {
    const alertEl = document.getElementById('ring-auth-alert');
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = `ring-auth-alert ${type}`;
    if (type === 'error') {
      container.sound.playDelete();
    } else {
      container.sound.playSuccess();
    }
  }

  clearAlert() {
    const alertEl = document.getElementById('ring-auth-alert');
    if (alertEl) {
      alertEl.className = 'ring-auth-alert';
      alertEl.textContent = '';
    }
  }

  async handleLogin() {
    const email = document.getElementById('ring-login-email').value;
    const password = document.getElementById('ring-login-password').value;
    const submitBtn = document.getElementById('btn-ring-submit-login');

    try {
      this.setLoading(submitBtn, true, 'Giriş Yapılıyor...');
      this.clearAlert();
      const session = await container.loginUseCase.execute({ email, password });
      this.showAlert('Giriş başarılı! Halka açılıyor...', 'success');
      container.sound.playSuccess();
      setTimeout(() => {
        this.hide();
        this.onAuthSuccess(session, false);
      }, 500);
    } catch (err) {
      this.showAlert(err.message || 'Giriş yapılamadı.');
    } finally {
      this.setLoading(submitBtn, false, '<span>Giriş Yap</span> →');
    }
  }

  async handleQuickDemo() {
    const submitBtn = document.getElementById('btn-ring-quick-demo');
    try {
      this.setLoading(submitBtn, true, 'Kokpit Hazırlanıyor...');
      this.clearAlert();
      const session = await container.loginUseCase.execute({
        email: 'kullanici@halka.os',
        password: 'demo-password-123',
      });
      this.showAlert('Demo oturumu açıldı! İyi çalışmalar...', 'success');
      container.sound.playSuccess();
      setTimeout(() => {
        this.hide();
        this.onAuthSuccess(session, false);
      }, 400);
    } catch (err) {
      this.showAlert(err.message || 'Demo girişi açılamadı.');
    } finally {
      this.setLoading(submitBtn, false, '⚡ Hızlı Demo');
    }
  }

  async handleAdminLogin() {
    const email = document.getElementById('ring-admin-email').value;
    const password = document.getElementById('ring-admin-password').value;
    const submitBtn = document.getElementById('btn-ring-submit-admin');

    try {
      this.setLoading(submitBtn, true, 'Yönetici Doğrulanıyor...');
      this.clearAlert();
      const session = await container.loginUseCase.execute({ email, password });
      this.showAlert('Süper Yönetici yetkilendirildi! Panel açılıyor...', 'success');
      container.sound.playSuccess();
      setTimeout(() => {
        this.hide();
        this.onAuthSuccess(session, true);
      }, 500);
    } catch (err) {
      this.showAlert(err.message || 'Yönetici girişi başarısız.');
    } finally {
      this.setLoading(submitBtn, false, '<span>🛡️ Kontrol Paneline Gir</span> →');
    }
  }

  async handleQuickAdmin() {
    const submitBtn = document.getElementById('btn-ring-quick-admin');
    try {
      this.setLoading(submitBtn, true, 'Yetkilendiriliyor...');
      this.clearAlert();
      const session = await container.loginUseCase.execute({
        email: 'admin@halka.os',
        password: 'admin-password-2026',
      });
      this.showAlert('Yönetici girişi başarılı! Panel açılıyor...', 'success');
      container.sound.playSuccess();
      setTimeout(() => {
        this.hide();
        this.onAuthSuccess(session, true);
      }, 400);
    } catch (err) {
      this.showAlert(err.message || 'Yönetici girişi açılamadı.');
    } finally {
      this.setLoading(submitBtn, false, '⚡ Tek Tıkla Panel Girişi');
    }
  }

  async handleRegister() {
    const name = document.getElementById('ring-register-name').value;
    const email = document.getElementById('ring-register-email').value;
    const password = document.getElementById('ring-register-password').value;
    const submitBtn = document.getElementById('btn-ring-submit-register');

    try {
      this.setLoading(submitBtn, true, 'Kayıt Yapılıyor...');
      this.clearAlert();
      const session = await container.registerUseCase.execute({ name, email, password });
      this.showAlert('Kayıt başarılı! Halka başlatılıyor...', 'success');
      container.sound.playSuccess();
      setTimeout(() => {
        this.hide();
        this.onAuthSuccess(session, false);
      }, 600);
    } catch (err) {
      this.showAlert(err.message || 'Kayıt başarısız.');
    } finally {
      this.setLoading(submitBtn, false, '<span>Halka\'yı Başlat (Kayıt)</span> ✨');
    }
  }

  async handleResetPassword() {
    const email = document.getElementById('ring-forgot-email').value;
    const submitBtn = document.getElementById('btn-ring-submit-forgot');

    try {
      this.setLoading(submitBtn, true, 'Gönderiliyor...');
      this.clearAlert();
      await container.resetPasswordUseCase.execute(email);
      this.showAlert('Şifre sıfırlama bağlantısı e-postanıza gönderildi.', 'success');
    } catch (err) {
      this.showAlert(err.message || 'Sıfırlama bağlantısı gönderilemedi.');
    } finally {
      this.setLoading(submitBtn, false, '<span>Sıfırlama Bağlantısı Gönder</span> 📨');
    }
  }

  async handleUpdatePassword() {
    const newPassword = document.getElementById('ring-reset-new-password')?.value;
    const confirmPassword = document.getElementById('ring-reset-confirm-password')?.value;
    const submitBtn = document.getElementById('btn-ring-submit-reset-password');

    if (!newPassword || newPassword.length < 6) {
      this.showAlert('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showAlert('Girdiğiniz şifreler birbiriyle uyuşmuyor.');
      return;
    }

    try {
      this.setLoading(submitBtn, true, 'Şifre Güncelleniyor...');
      this.clearAlert();
      await container.updatePasswordUseCase.execute(newPassword);
      this.showAlert('Şifreniz başarıyla güncellendi! Halka açılıyor...', 'success');
      container.sound.playSuccess();

      // URL'deki recovery hash'ini temizle
      if (window.location.hash && window.location.hash.includes('type=recovery')) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      const session = await container.getSessionUseCase.execute();
      setTimeout(() => {
        this.hide();
        this.onAuthSuccess(session, false);
      }, 700);
    } catch (err) {
      this.showAlert(err.message || 'Şifre güncellenemedi.');
    } finally {
      this.setLoading(submitBtn, false, '<span>Şifremi Güncelle ve Giriş Yap</span> ✨');
    }
  }

  setLoading(button, isLoading, content) {
    if (!button) return;
    button.disabled = isLoading;
    button.innerHTML = content;
  }

  show() {
    if (!this.ringWrapper) this.ringWrapper = document.getElementById('central-ring-wrapper');
    if (!this.mainCanvas) this.mainCanvas = document.getElementById('halka-main-canvas');
    if (!this.authPane) this.authPane = document.getElementById('core-auth-view');

    // 1. Üst barı gizlemek ve arka planı odaklamak için body sınıfını ekle
    document.body.classList.add('auth-mode-active');

    // 2. Ring'i Auth Modunda Büyüt ve Işıltıyı Aç
    if (this.ringWrapper) {
      this.ringWrapper.classList.add('ring-auth-mode');
    }

    if (this.mainCanvas) {
      this.mainCanvas.classList.add('auth-active');
    }

    // 3. Çekirdek Merkezindeki Panelleri Değiştir
    const overviewPane = document.getElementById('core-overview-view');
    const focusedPane = document.getElementById('core-focused-view');
    if (overviewPane) overviewPane.classList.remove('active');
    if (focusedPane) focusedPane.classList.remove('active');

    if (this.authPane) {
      this.authPane.classList.add('active');
      const input = document.getElementById('ring-login-email');
      if (input) setTimeout(() => input.focus(), 120);
    }

    this.clearAlert();
  }

  hide() {
    if (!this.ringWrapper) this.ringWrapper = document.getElementById('central-ring-wrapper');
    if (!this.mainCanvas) this.mainCanvas = document.getElementById('halka-main-canvas');
    if (!this.authPane) this.authPane = document.getElementById('core-auth-view');

    // 1. Auth modunu kaldır -> Üst bar pürüzsüzce yukarıdan aşağıya kayarak açılır!
    document.body.classList.remove('auth-mode-active');

    // 2. Ring'i Normal Boyuta Döndür
    if (this.ringWrapper) {
      this.ringWrapper.classList.remove('ring-auth-mode');
    }

    if (this.mainCanvas) {
      this.mainCanvas.classList.remove('auth-active');
    }

    // 3. Çekirdek Merkezini Genel Bakış Paneline Döndür
    if (this.authPane) {
      this.authPane.classList.remove('active');
    }

    const overviewPane = document.getElementById('core-overview-view');
    if (overviewPane) {
      overviewPane.classList.add('active');
    }
  }
}
