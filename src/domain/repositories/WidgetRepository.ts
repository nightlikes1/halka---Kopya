import { WidgetsData } from '../entities/Widget';

export interface WidgetRepository {
  getActiveWidgetIds(): Promise<string[]>;
  saveActiveWidgetIds(ids: string[]): Promise<void>;
  getWidgetsData(): Promise<WidgetsData>;
  getWidgetData<T>(widgetId: string): Promise<T | null>;
  saveWidgetData<T>(widgetId: string, data: Partial<T>): Promise<void>;
}
