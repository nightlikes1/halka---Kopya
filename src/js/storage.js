import { container } from '../core/container';
import { DEFAULT_DATA } from './storage_defaults.js';

const LAST_USER_KEY = 'halka:last_active_user_id';
const LAST_USER_NAME_KEY = 'halka:last_active_user_name';

export class StorageManager {
  constructor() {
    this.currentUserId = this.getInitialUserId();
    this.data = this.load();
    this.checkDailyReset();
  }

  getInitialUserId() {
    try {
      const stored = localStorage.getItem(LAST_USER_KEY);
      if (stored) return stored;

      // Also check Supabase auth token in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            const uid = parsed?.user?.id || parsed?.currentSession?.user?.id;
            if (uid) return uid;
          }
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  getInitialUserName() {
    try {
      return localStorage.getItem(LAST_USER_NAME_KEY) || null;
    } catch {
      return null;
    }
  }

  getStorageKey() {
    return this.currentUserId
      ? `halka_user_${this.currentUserId}_data_v2`
      : 'halka_guest_data_v2';
  }

  load() {
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          activeWidgetIds: Array.isArray(parsed.activeWidgetIds) ? parsed.activeWidgetIds : [],
          profile: { ...DEFAULT_DATA.profile, ...(parsed.profile || {}) },
          widgetsData: {
            ...JSON.parse(JSON.stringify(DEFAULT_DATA.widgetsData)),
            ...(parsed.widgetsData || {})
          }
        };
      }
    } catch (e) {
      console.warn('Halka: Storage read failed, falling back to defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  save() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.data));
    } catch (e) {
      console.error('Halka: Storage save error', e);
    }
  }

  switchUserLocal(userId, userName) {
    this.currentUserId = userId || null;
    if (this.currentUserId) {
      try {
        localStorage.setItem(LAST_USER_KEY, this.currentUserId);
        if (userName) {
          localStorage.setItem(LAST_USER_NAME_KEY, userName);
        }
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(LAST_USER_KEY);
        localStorage.removeItem(LAST_USER_NAME_KEY);
      } catch {
        // ignore
      }
    }

    this.data = this.load();

    if (userName) {
      this.data.profile.name = userName;
      this.save();
    }

    return this.data;
  }

  async syncRemote() {
    if (!this.currentUserId) return false;

    try {
      const remote = await container.loadData.execute();
      if (!remote) return false;

      let changed = false;

      // Update activeWidgetIds if remote has valid list
      if (Array.isArray(remote.activeWidgetIds)) {
        if (JSON.stringify(this.data.activeWidgetIds) !== JSON.stringify(remote.activeWidgetIds)) {
          this.data.activeWidgetIds = remote.activeWidgetIds;
          changed = true;
        }
      }

      // Merge remote widgetsData
      if (remote.widgetsData) {
        this.data.widgetsData = {
          ...JSON.parse(JSON.stringify(DEFAULT_DATA.widgetsData)),
          ...(this.data.widgetsData || {}),
          ...remote.widgetsData
        };
        changed = true;
      }

      // Merge profile
      if (remote.profile) {
        this.data.profile = {
          ...this.data.profile,
          ...remote.profile,
          name: this.data.profile.name || remote.profile.name
        };
        changed = true;
      }

      if (changed) {
        this.save();
      }

      return changed;
    } catch (err) {
      console.warn('Halka: Background remote sync failed, using cached local data', err);
      return false;
    }
  }

  async switchUser(userId, userName) {
    this.switchUserLocal(userId, userName);
    await this.syncRemote();
    return this.data;
  }

  checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    if (this.data.profile.lastActiveDate !== today) {
      this.data.profile.lastActiveDate = today;
      this.save();
    }
  }

  getProfile() {
    return this.data.profile;
  }

  updateProfile(updates) {
    this.data.profile = { ...this.data.profile, ...updates };
    this.save();
    // Synchronize through clean architecture usecase
    container.updateProfile.execute(updates).catch(() => {});
  }

  getActiveWidgetIds() {
    return Array.isArray(this.data.activeWidgetIds) ? this.data.activeWidgetIds : [];
  }

  addWidget(id) {
    if (!this.data.activeWidgetIds.includes(id)) {
      this.data.activeWidgetIds.push(id);
      this.save();
      container.widgetRepo.saveActiveWidgetIds(this.data.activeWidgetIds).catch(() => {});
      return true;
    }
    return false;
  }

  removeWidget(id) {
    this.data.activeWidgetIds = this.data.activeWidgetIds.filter(item => item !== id);
    this.save();
    container.widgetRepo.saveActiveWidgetIds(this.data.activeWidgetIds).catch(() => {});
  }

  reorderWidgets(newOrder) {
    this.data.activeWidgetIds = newOrder;
    this.save();
    container.widgetRepo.saveActiveWidgetIds(this.data.activeWidgetIds).catch(() => {});
  }

  getWidgetData(id) {
    return this.data.widgetsData[id] || {};
  }

  updateWidgetData(id, partialData) {
    this.data.widgetsData[id] = {
      ...(this.data.widgetsData[id] || {}),
      ...partialData
    };
    this.save();
    // Synchronize through clean architecture usecase
    container.updateWidgetData.execute(id, partialData).catch(() => {});
  }

  resetAll() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
    container.widgetRepo.saveActiveWidgetIds([]).catch(() => {});
    Object.keys(DEFAULT_DATA.widgetsData).forEach(wId => {
      container.widgetRepo.saveWidgetData(wId, DEFAULT_DATA.widgetsData[wId]).catch(() => {});
    });
  }
}

export const storage = new StorageManager();

