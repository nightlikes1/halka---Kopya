import { Activity } from '../entities/Activity';
import { Entry } from '../entities/Entry';
import { UserProfile, WidgetsData } from '../entities/Widget';
import { ActivityRepository } from '../repositories/ActivityRepository';
import { EntryRepository } from '../repositories/EntryRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { WidgetRepository } from '../repositories/WidgetRepository';

export interface LoadedAppData {
  activities: Activity[];
  entries: Entry[];
  activeWidgetIds: string[];
  widgetsData: WidgetsData;
  profile: UserProfile;
}

export class LoadData {
  constructor(
    private activities: ActivityRepository,
    private entries: EntryRepository,
    private widgets: WidgetRepository,
    private profile: ProfileRepository,
  ) {}

  async execute(): Promise<LoadedAppData> {
    const [activities, entries, activeWidgetIds, widgetsData, profile] = await Promise.all([
      this.activities.getAll(),
      this.entries.getAll(),
      this.widgets.getActiveWidgetIds(),
      this.widgets.getWidgetsData(),
      this.profile.getProfile(),
    ]);

    return {
      activities,
      entries,
      activeWidgetIds,
      widgetsData,
      profile,
    };
  }
}
