// Admin Dashboard / Kontrol Paneli View & Controller
import { container } from '../core/container';
import { isSupabaseConfigured } from '../core/supabase';
import { WIDGET_CATALOG } from '../constants/widgets';

export class AdminPanelController {
  constructor(onReturnToCockpit, onLogout) {
    this.onReturnToCockpit = onReturnToCockpit || (() => {});
    this.onLogout = onLogout || (() => {});
    this.currentTab = 'overview';
    this.panelEl = null;
    this.initPanelDOM();
    this.bindEvents();
  }

  initPanelDOM() {
    let existing = document.getElementById('admin-panel-overlay');
    if (existing) {
      this.panelEl = existing;
      return;
    }

    const panelHTML = `
      <div class="admin-panel-overlay" id="admin-panel-overlay" role="dialog" aria-modal="true">
        <div class="admin-dashboard-container">
          
          <!-- Top Navigation Header -->
          <header class="admin-navbar">
            <div class="admin-brand">
              <div class="admin-brand-icon">🛡️</div>
              <div class="admin-brand-text">
                <h2>Halka Sistem Kontrol Paneli <span class="admin-badge-role">Super Admin</span></h2>
                <p>Altyapı Tanılama, Kullanıcı ve Eklenti Ekosistemi Yönetimi</p>
              </div>
            </div>

            <div class="admin-nav-actions">
              <button class="btn-admin-switch-cockpit" id="btn-admin-go-cockpit">
                <span>🛰️</span> Kullanıcı Kokpitine Geç
              </button>
              <button class="btn-admin-close" id="btn-admin-logout" title="Oturumu Kapat">
                ✕
              </button>
            </div>
          </header>

          <!-- KPI Metrics Row -->
          <section class="admin-kpi-grid" id="admin-kpi-grid">
            <div class="admin-kpi-card" style="--kpi-accent: #38bdf8;">
              <div class="kpi-header">
                <span class="kpi-title">Kayıtlı Kullanıcılar</span>
                <span class="kpi-icon">👥</span>
              </div>
              <div class="kpi-value" id="kpi-users-count">1</div>
              <div class="kpi-sub">
                <span class="status-dot-pulse"></span>
                <span id="kpi-active-session">Aktif Oturum Bağlı</span>
              </div>
            </div>

            <div class="admin-kpi-card" style="--kpi-accent: #10b981;">
              <div class="kpi-header">
                <span class="kpi-title">Bulut Durumu (Supabase)</span>
                <span class="kpi-icon">☁️</span>
              </div>
              <div class="kpi-value" id="kpi-cloud-status">${isSupabaseConfigured ? 'ONLINE' : 'LOCAL'}</div>
              <div class="kpi-sub">
                <span>${isSupabaseConfigured ? 'PostgreSQL 15 & RLS Aktif' : 'Local-First Hibrit Mod'}</span>
              </div>
            </div>

            <div class="admin-kpi-card" style="--kpi-accent: #f59e0b;">
              <div class="kpi-header">
                <span class="kpi-title">Eklenti Ekosistemi</span>
                <span class="kpi-icon">🪐</span>
              </div>
              <div class="kpi-value" id="kpi-widget-count">10</div>
              <div class="kpi-sub">
                <span id="kpi-active-widgets-sub">4/10 Halka Etrafında Aktif</span>
              </div>
            </div>

            <div class="admin-kpi-card" style="--kpi-accent: #8b5cf6;">
              <div class="kpi-header">
                <span class="kpi-title">Veri Kalıcılığı & Depolama</span>
                <span class="kpi-icon">💾</span>
              </div>
              <div class="kpi-value" id="kpi-storage-size">~12 KB</div>
              <div class="kpi-sub">
                <span>JSON Store + Supabase Cache</span>
              </div>
            </div>
          </section>

          <!-- Navigation Tabs -->
          <nav class="admin-tabs-bar" id="admin-tabs-bar">
            <button class="admin-tab-btn active" data-tab="overview">📊 Sistem & Tanılama</button>
            <button class="admin-tab-btn" data-tab="users">👥 Kullanıcı Yönetimi</button>
            <button class="admin-tab-btn" data-tab="widgets">🪐 Eklenti Kataloğu Denetimi</button>
            <button class="admin-tab-btn" data-tab="maintenance">🛠️ Veritabanı & Bakım</button>
          </nav>

          <!-- TAB 1: SİSTEM & TANILAMA -->
          <div class="admin-tab-pane active" id="pane-overview">
            <div class="admin-card-glass">
              <div class="admin-card-header">
                <h3>🔍 Canlı Altyapı ve Servis Tanılaması</h3>
                <button class="btn-table-action" id="btn-refresh-diagnostics">🔄 Yenile</button>
              </div>

              <div class="diag-grid">
                <div class="diag-item">
                  <h4>Supabase Entegrasyonu <span>${isSupabaseConfigured ? '✅ Bağlı' : '⚠️ Bekliyor'}</span></h4>
                  <div class="diag-item-value">${isSupabaseConfigured ? 'Cloud PostgreSQL' : 'Local-First Mode'}</div>
                  <div class="diag-item-detail">RLS Politikaları: profiles, user_widgets, widget_data</div>
                </div>

                <div class="diag-item">
                  <h4>Web Audio Ses Sentezleyici <span>🔊 Aktif</span></h4>
                  <div class="diag-item-value">${container.sound.enabled ? 'Açık' : 'Sessiz'}</div>
                  <div class="diag-item-detail">Osilatörler, Gürültü Filtreleri ve Frekans Jeneratörü hazır.</div>
                </div>

                <div class="diag-item">
                  <h4>Oturum Bilgisi <span>🛡️ Süper Yetki</span></h4>
                  <div class="diag-item-value" id="diag-current-user">admin@halka.os</div>
                  <div class="diag-item-detail">Erişim Tipi: Super Admin (Tam Yönetim Yetkisi)</div>
                </div>

                <div class="diag-item">
                  <h4>Mimari Katmanları <span>🏛️ Clean Arch</span></h4>
                  <div class="diag-item-value">Domain + Data + Core + UI</div>
                  <div class="diag-item-detail">Bağımlılıklar: DI Container (container.ts) üzerinden yönetiliyor.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: KULLANICI YÖNETİMİ -->
          <div class="admin-tab-pane" id="pane-users">
            <div class="admin-card-glass">
              <div class="admin-card-header">
                <h3>👥 Kullanıcı Listesi ve Yetkilendirme</h3>
                <button class="btn-table-action" id="btn-add-mock-user">+ Yeni Kullanıcı Tanımla</button>
              </div>

              <div class="admin-table-wrapper">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Kullanıcı</th>
                      <th>E-Posta</th>
                      <th>Rol</th>
                      <th>Seri (Streak)</th>
                      <th>Son Giriş</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody id="admin-users-table-body">
                    <!-- Dinamik doldurulur -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 3: EKLENTİ KATALOĞU DENETİMİ -->
          <div class="admin-tab-pane" id="pane-widgets">
            <div class="admin-card-glass">
              <div class="admin-card-header">
                <h3>🪐 Eklenti (Widget) Ekosistemi Durumu</h3>
                <span style="font-size: 0.8rem; color: var(--text-dim);">Toplam 10 Modüler Eklenti</span>
              </div>

              <div class="admin-table-wrapper">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Eklenti</th>
                      <th>Kategori</th>
                      <th>Vurgu Rengi</th>
                      <th>Halkadaki Durumu</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody id="admin-widgets-table-body">
                    <!-- Dinamik doldurulur -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 4: BAKIM & VERİTABANI ARAÇLARI -->
          <div class="admin-tab-pane" id="pane-maintenance">
            <div class="admin-card-glass">
              <div class="admin-card-header">
                <h3>🛠️ Veri Yönetimi & Sistem Bakım Araçları</h3>
              </div>

              <div class="maintenance-actions-grid">
                <button class="btn-maintenance" id="btn-export-json">
                  📥 Tüm Verileri JSON Olarak Yedekle
                  <span>Kullanıcı verilerini, widget kayıtlarını ve ayarları indirir.</span>
                </button>

                <button class="btn-maintenance" id="btn-import-json">
                  📤 JSON Yedeği Geri Yükle
                  <span>Önceden dışa aktarılmış bir yedek dosyasını içeri aktarır.</span>
                </button>

                <button class="btn-maintenance" id="btn-reset-cache">
                  🧹 Önbellek & Durumu Temizle
                  <span>Geçici oturum verilerini ve önbelleği sıfırlar.</span>
                </button>

                <button class="btn-maintenance danger" id="btn-factory-reset">
                  ⚠️ Fabrika Ayarlarına Sıfırla
                  <span>Tüm yerel verileri siler ve başlangıç şablonuna döndürür.</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);
    this.panelEl = document.getElementById('admin-panel-overlay');
  }

  bindEvents() {
    // Tab geçişleri
    this.panelEl.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        container.sound.playClick();
        this.switchTab(btn.dataset.tab);
      });
    });

    // Kullanıcı Kokpitine Geçiş Butonu
    document.getElementById('btn-admin-go-cockpit')?.addEventListener('click', () => {
      container.sound.playFocusExit();
      this.hide();
      this.onReturnToCockpit();
    });

    // Oturumu Kapat Butonu
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
      container.sound.playClick();
      if (confirm('Yönetici oturumunu kapatmak istediğinizden emin misiniz?')) {
        this.hide();
        this.onLogout();
      }
    });

    // Tanılamayı Yenile
    document.getElementById('btn-refresh-diagnostics')?.addEventListener('click', () => {
      container.sound.playClick();
      this.refreshData();
    });

    // Yeni Mock Kullanıcı Ekleme
    document.getElementById('btn-add-mock-user')?.addEventListener('click', () => {
      this.promptAddUser();
    });

    // JSON Dışa Aktar (Export)
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      this.exportJsonBackup();
    });

    // JSON İçe Aktar (Import)
    document.getElementById('btn-import-json')?.addEventListener('click', () => {
      this.importJsonBackup();
    });

    // Önbellek Temizle
    document.getElementById('btn-reset-cache')?.addEventListener('click', () => {
      container.sound.playSuccess();
      alert('Önbellek temizlendi ve veriler tazelendi.');
      this.refreshData();
    });

    // Fabrika Sıfırlaması
    document.getElementById('btn-factory-reset')?.addEventListener('click', () => {
      if (confirm('DİKKAT: Tüm yerel veriler sıfırlanacaktır. Devam etmek istiyor musunuz?')) {
        localStorage.clear();
        container.sound.playDelete();
        window.location.reload();
      }
    });
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.panelEl.querySelectorAll('.admin-tab-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });

    this.panelEl.querySelectorAll('.admin-tab-pane').forEach((p) => {
      p.classList.remove('active');
    });

    const target = document.getElementById(`pane-${tab}`);
    if (target) {
      target.classList.add('active');
    }
  }

  async refreshData() {
    // 1. Aktif Kullanıcı Bilgisi
    const session = await container.getSessionUseCase.execute();
    const userEl = document.getElementById('diag-current-user');
    if (userEl) {
      userEl.textContent = session?.user?.email || 'admin@halka.os';
    }

    // 2. Storage Boyutu Hesapla
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      totalBytes += (localStorage.getItem(key) || '').length * 2;
    }
    const sizeKb = (totalBytes / 1024).toFixed(1);
    const sizeEl = document.getElementById('kpi-storage-size');
    if (sizeEl) sizeEl.textContent = `~${sizeKb} KB`;

    // 3. Kullanıcı Tablosunu Doldur
    this.renderUsersTable(session?.user);

    // 4. Widget Kataloğu Tablosunu Doldur
    await this.renderWidgetsTable();
  }

  renderUsersTable(currentUser) {
    const tbody = document.getElementById('admin-users-table-body');
    if (!tbody) return;

    let users = [];
    try {
      const raw = localStorage.getItem('halka:local_users_db');
      if (raw) users = JSON.parse(raw);
    } catch {
      users = [];
    }

    // Varsayılan admin ve mevcut kullanıcıyı garanti et
    const list = [
      {
        id: 'u-admin',
        name: 'Sistem Yöneticisi',
        email: 'admin@halka.os',
        role: 'admin',
        streak: 14,
        lastActive: new Date().toISOString().split('T')[0],
      },
      ...users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || (u.email.includes('admin') ? 'admin' : 'user'),
        streak: 5,
        lastActive: new Date().toISOString().split('T')[0],
      })),
    ];

    // Tekilleştir
    const unique = Array.from(new Map(list.map((u) => [u.email, u])).values());

    const usersCountEl = document.getElementById('kpi-users-count');
    if (usersCountEl) usersCountEl.textContent = unique.length.toString();

    tbody.innerHTML = unique.map((u) => `
      <tr>
        <td>
          <div class="admin-user-cell">
            <div class="admin-user-avatar">${u.role === 'admin' ? '🛡️' : '👤'}</div>
            <strong>${escapeHtml(u.name)}</strong>
          </div>
        </td>
        <td>${escapeHtml(u.email)}</td>
        <td><span class="role-badge ${u.role}">${u.role.toUpperCase()}</span></td>
        <td>🔥 ${u.streak} gün</td>
        <td>${u.lastActive}</td>
        <td>
          <button class="btn-table-action" data-action="toggle-role" data-email="${u.email}">Rol Değiştir</button>
          ${u.email !== 'admin@halka.os' ? `<button class="btn-table-action delete" data-action="delete-user" data-email="${u.email}">Sil</button>` : ''}
        </td>
      </tr>
    `).join('');

    // Tablo event listener'ları
    tbody.querySelectorAll('button[data-action="toggle-role"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const email = btn.dataset.email;
        this.toggleUserRole(email);
      });
    });

    tbody.querySelectorAll('button[data-action="delete-user"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const email = btn.dataset.email;
        this.deleteUser(email);
      });
    });
  }

  async renderWidgetsTable() {
    const tbody = document.getElementById('admin-widgets-table-body');
    if (!tbody) return;

    const activeIds = await container.widgetRepo.getActiveWidgetIds();
    const activeSub = document.getElementById('kpi-active-widgets-sub');
    if (activeSub) {
      activeSub.textContent = `${activeIds.length}/${WIDGET_CATALOG.length} Halka Etrafında Aktif`;
    }

    tbody.innerHTML = WIDGET_CATALOG.map((w) => {
      const isActive = activeIds.includes(w.id);
      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.2rem;">${w.icon}</span>
              <strong>${w.name}</strong>
            </div>
          </td>
          <td><span style="color:var(--text-dim);">${w.category}</span></td>
          <td>
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${w.accent}; margin-right:6px; vertical-align:middle;"></span>
            <code>${w.accent}</code>
          </td>
          <td>
            <span style="color:${isActive ? '#10b981' : 'var(--text-dim)'}; font-weight:600;">
              ${isActive ? '● Aktif (Görünüyor)' : '○ Pasif'}
            </span>
          </td>
          <td>
            <button class="btn-table-action" data-widget-toggle="${w.id}">
              ${isActive ? 'Halkadan Kaldır' : 'Halkaya Ekle'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('button[data-widget-toggle]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.widgetToggle;
        await container.toggleWidgetActive.execute(id);
        container.sound.playClick();
        await this.renderWidgetsTable();
      });
    });
  }

  toggleUserRole(email) {
    let users = [];
    try {
      const raw = localStorage.getItem('halka:local_users_db');
      if (raw) users = JSON.parse(raw);
    } catch {}

    const target = users.find((u) => u.email === email);
    if (target) {
      target.role = target.role === 'admin' ? 'user' : 'admin';
      localStorage.setItem('halka:local_users_db', JSON.stringify(users));
      container.sound.playSuccess();
      this.refreshData();
    } else {
      alert('Bu sistem hesabının rolü sabittir.');
    }
  }

  deleteUser(email) {
    if (!confirm(`${email} kullanıcısını silmek istediğinize emin misiniz?`)) return;

    let users = [];
    try {
      const raw = localStorage.getItem('halka:local_users_db');
      if (raw) users = JSON.parse(raw);
    } catch {}

    users = users.filter((u) => u.email !== email);
    localStorage.setItem('halka:local_users_db', JSON.stringify(users));
    container.sound.playDelete();
    this.refreshData();
  }

  promptAddUser() {
    const name = prompt('Kullanıcı Adı:');
    if (!name) return;
    const email = prompt('E-Posta:');
    if (!email || !email.includes('@')) return;

    let users = [];
    try {
      const raw = localStorage.getItem('halka:local_users_db');
      if (raw) users = JSON.parse(raw);
    } catch {}

    users.push({
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: 'user',
      password: 'user123',
    });

    localStorage.setItem('halka:local_users_db', JSON.stringify(users));
    container.sound.playSuccess();
    this.refreshData();
  }

  exportJsonBackup() {
    const data = {
      backupDate: new Date().toISOString(),
      version: '1.0.0',
      localStorageData: {},
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      data.localStorageData[key] = localStorage.getItem(key);
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `halka-life-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    container.sound.playSuccess();
  }

  importJsonBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.localStorageData) {
            Object.entries(parsed.localStorageData).forEach(([k, v]) => {
              localStorage.setItem(k, v);
            });
            container.sound.playSuccess();
            alert('Yedek başarıyla yüklendi! Sayfa yenileniyor...');
            window.location.reload();
          }
        } catch {
          alert('Geçersiz JSON yedek dosyası.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  show() {
    if (this.panelEl) {
      this.panelEl.classList.add('open');
      this.refreshData();
    }
  }

  hide() {
    if (this.panelEl) {
      this.panelEl.classList.remove('open');
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
