import { WidgetRepository } from '../repositories/WidgetRepository';

export class ToggleWidgetActive {
  constructor(private repo: WidgetRepository) {}

  async execute(widgetId: string): Promise<string[]> {
    const current = await this.repo.getActiveWidgetIds();
    const exists = current.includes(widgetId);
    let updated: string[];
    if (exists) {
      updated = current.filter((id) => id !== widgetId);
    } else {
      updated = [...current, widgetId];
    }
    await this.repo.saveActiveWidgetIds(updated);
    return updated;
  }
}
