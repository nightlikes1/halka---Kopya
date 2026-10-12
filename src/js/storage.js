import { container } from '../core/container';
import { DEFAULT_DATA } from './storage_defaults.js';

const STORAGE_KEY = 'halka_life_os_data_v1';

export class StorageManager {
  constructor() {
    this.data = this.load();
    this.checkDailyReset();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          profile: { ...DEFAULT_DATA.profile, ...(parsed.profile || {}) },
          widgetsData: { ...DEFAULT_DATA.widgetsData, ...(parsed.widgetsData || {}) }
        };
      }
    } catch (e) {
      console.warn('Halka: Storage read failed, falling back to defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Halka: Storage save error', e);
    }
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
    return this.data.activeWidgetIds;
  }

  addWidget(id) {
    if (!this.data.activeWidgetIds.includes(id)) {
      this.data.activeWidgetIds.push(id);
      this.save();
      container.toggleWidgetActive.execute(id).catch(() => {});
      return true;
    }
    return false;
  }

  removeWidget(id) {
    this.data.activeWidgetIds = this.data.activeWidgetIds.filter(item => item !== id);
    this.save();
    container.toggleWidgetActive.execute(id).catch(() => {});
  }

  reorderWidgets(newOrder) {
    this.data.activeWidgetIds = newOrder;
    this.save();
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
  }
}

export const storage = new StorageManager();
