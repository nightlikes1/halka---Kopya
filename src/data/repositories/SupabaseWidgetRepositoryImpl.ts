import { SupabaseClient } from '@supabase/supabase-js';
import { WidgetsData } from '@/domain/entities/Widget';
import { WidgetRepository } from '@/domain/repositories/WidgetRepository';
import { DEFAULT_ACTIVE_WIDGET_IDS, DEFAULT_WIDGETS_DATA } from '@/constants/widgets';
import { isSupabaseConfigured } from '@/core/supabase';
import { readJson, writeJson } from '../storage/jsonStore';

const ACTIVE_WIDGETS_KEY = 'halka:active_widgets';
const WIDGETS_DATA_KEY = 'halka:widgets_data';

export class SupabaseWidgetRepositoryImpl implements WidgetRepository {
  constructor(private client: SupabaseClient) {}

  private async getUserId(): Promise<string | null> {
    if (!isSupabaseConfigured) return null;
    const { data: { session } } = await this.client.auth.getSession();
    return session?.user?.id || null;
  }

  async getActiveWidgetIds(): Promise<string[]> {
    const userId = await this.getUserId();
    const storageKey = userId ? `halka:active_widgets:${userId}` : ACTIVE_WIDGETS_KEY;

    if (userId) {
      try {
        const { data, error } = await this.client
          .from('user_widgets')
          .select('widget_id, is_active')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data) {
          const ids = data.map((row) => row.widget_id);
          await writeJson(storageKey, ids);
          return ids;
        }
      } catch (err) {
        console.warn('Supabase getActiveWidgetIds fallback to local', err);
      }
    }

    return readJson<string[]>(storageKey, DEFAULT_ACTIVE_WIDGET_IDS);
  }

  async saveActiveWidgetIds(ids: string[]): Promise<void> {
    const userId = await this.getUserId();
    const storageKey = userId ? `halka:active_widgets:${userId}` : ACTIVE_WIDGETS_KEY;
    await writeJson(storageKey, ids);

    if (userId) {
      try {
        const { data: existingRows } = await this.client
          .from('user_widgets')
          .select('widget_id')
          .eq('user_id', userId);

        const existingIds = new Set((existingRows || []).map((r) => r.widget_id));

        const updates = ids.map((widgetId, index) => ({
          user_id: userId,
          widget_id: widgetId,
          is_active: true,
          display_order: index,
        }));

        if (updates.length > 0) {
          await this.client
            .from('user_widgets')
            .upsert(updates, { onConflict: 'user_id,widget_id' });
        }

        const deactivatedIds = Array.from(existingIds).filter((id) => !ids.includes(id));
        if (deactivatedIds.length > 0) {
          await this.client
            .from('user_widgets')
            .update({ is_active: false })
            .eq('user_id', userId)
            .in('widget_id', deactivatedIds);
        }
      } catch (err) {
        console.warn('Supabase saveActiveWidgetIds sync error', err);
      }
    }
  }

  async getWidgetsData(): Promise<WidgetsData> {
    const userId = await this.getUserId();
    const storageKey = userId ? `halka:widgets_data:${userId}` : WIDGETS_DATA_KEY;

    if (userId) {
      try {
        const { data, error } = await this.client
          .from('widget_data')
          .select('widget_id, data')
          .eq('user_id', userId);

        if (!error && data) {
          const result: Record<string, unknown> = JSON.parse(JSON.stringify(DEFAULT_WIDGETS_DATA));
          data.forEach((row) => {
            if (row.widget_id && row.data) {
              result[row.widget_id] = {
                ...(result[row.widget_id] || {}),
                ...row.data,
              };
            }
          });
          await writeJson(storageKey, result);
          return result as unknown as WidgetsData;
        }
      } catch (err) {
        console.warn('Supabase getWidgetsData fallback to local', err);
      }
    }

    return readJson<WidgetsData>(storageKey, DEFAULT_WIDGETS_DATA);
  }

  async getWidgetData<T>(widgetId: string): Promise<T | null> {
    const all = await this.getWidgetsData();
    return (all[widgetId] as T) || null;
  }

  async saveWidgetData<T>(widgetId: string, partialData: Partial<T>): Promise<void> {
    const all = await this.getWidgetsData();
    const existing = (all[widgetId] || {}) as Record<string, unknown>;
    all[widgetId] = { ...existing, ...partialData };

    const userId = await this.getUserId();
    const storageKey = userId ? `halka:widgets_data:${userId}` : WIDGETS_DATA_KEY;
    await writeJson(storageKey, all);

    if (userId) {
      try {
        await this.client.from('widget_data').upsert(
          {
            user_id: userId,
            widget_id: widgetId,
            data: all[widgetId],
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,widget_id' }
        );
      } catch (err) {
        console.warn('Supabase saveWidgetData sync error', err);
      }
    }
  }
}
