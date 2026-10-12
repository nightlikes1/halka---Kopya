import { WidgetRepository } from '../repositories/WidgetRepository';

export class UpdateWidgetData {
  constructor(private repo: WidgetRepository) {}

  async execute<T>(widgetId: string, data: Partial<T>): Promise<void> {
    await this.repo.saveWidgetData(widgetId, data);
  }
}
