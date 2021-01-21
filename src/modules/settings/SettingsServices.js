import settings from '../../../settings';

const settingsToUse = process.env.environment ? settings[process.env.environment] : settings.local;

export default class SettingsServices {
  static getSettings() {
    return settingsToUse;
  }
}
