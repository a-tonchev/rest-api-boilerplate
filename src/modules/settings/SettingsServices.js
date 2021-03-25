import settings from '../../../settings';

const settingsToUse = process.env.environment ? settings[process.env.environment] : settings.local;

const SettingsServices = {
  getSettings() {
    return settingsToUse;
  },
};

export default SettingsServices;
