import { WidgetsData } from '@/domain/entities/Widget';
import { WidgetRepository } from '@/domain/repositories/WidgetRepository';
import { DEFAULT_ACTIVE_WIDGET_IDS, DEFAULT_WIDGETS_DATA } from '@/constants/widgets';
import { readJson, writeJson } from '../storage/jsonStore';

const ACTIVE_WIDGETS_KEY = 'halka:active_widgets';
const WIDGETS_DATA_KEY = 'halka:widgets_data';

export class WidgetRepositoryImpl implements WidgetRepository {
  async getActiveWidgetIds(): Promise<string[]> {
    return readJson<string[]>(ACTIVE_WIDGETS_KEY, DEFAULT_ACTIVE_WIDGET_IDS);
  }

  async saveActiveWidgetIds(ids: string[]): Promise<void> {
    await writeJson(ACTIVE_WIDGETS_KEY, ids);
  }

  async getWidgetsData(): Promise<WidgetsData> {
    return readJson<WidgetsData>(WIDGETS_DATA_KEY, DEFAULT_WIDGETS_DATA);
  }

  async getWidgetData<T>(widgetId: string): Promise<T | null> {
    const all = await this.getWidgetsData();
    return (all[widgetId] as T) || null;
  }

  async saveWidgetData<T>(widgetId: string, data: Partial<T>): Promise<void> {
    const all = await this.getWidgetsData();
    const existing = (all[widgetId] || {}) as Record<string, unknown>;
    all[widgetId] = { ...existing, ...data };
    await writeJson(WIDGETS_DATA_KEY, all);
  }
}
