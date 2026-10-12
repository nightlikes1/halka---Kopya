import { ProfileRepositoryImpl } from '@/data/repositories/ProfileRepositoryImpl';
import { WidgetRepositoryImpl } from '@/data/repositories/WidgetRepositoryImpl';
import { GenerateBriefing } from '@/domain/usecases/GenerateBriefing';
import { LoadData } from '@/domain/usecases/LoadData';
import { ToggleWidgetActive } from '@/domain/usecases/ToggleWidgetActive';
import { UpdateProfile } from '@/domain/usecases/UpdateProfile';
import { UpdateWidgetData } from '@/domain/usecases/UpdateWidgetData';
import { sound } from './audio';
import * as motion from './motion';

const widgetRepo = new WidgetRepositoryImpl();
const profileRepo = new ProfileRepositoryImpl();

/** Clean Architecture: Bağımlılıkların tek bir merkezde bağlandığı DI Container */
export const container = {
  // Repositories
  widgetRepo,
  profileRepo,

  // Use Cases
  loadData: new LoadData(
    { getAll: async () => [], save: async () => {}, remove: async () => {} },
    { getAll: async () => [], add: async () => {}, removeLast: async () => {}, removeByActivity: async () => {} },
    widgetRepo,
    profileRepo,
  ),
  updateWidgetData: new UpdateWidgetData(widgetRepo),
  toggleWidgetActive: new ToggleWidgetActive(widgetRepo),
  updateProfile: new UpdateProfile(profileRepo),
  generateBriefing: new GenerateBriefing(),

  // Core Services
  sound,
  motion,
};
