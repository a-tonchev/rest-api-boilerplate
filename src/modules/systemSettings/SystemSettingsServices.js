import settings from '../../../settings';

const systemSettings = process.env.environment ? settings[process.env.environment] : settings.local;

const { apiPrefix, apiVersion } = systemSettings;

const SystemSettingsServices = {
  getSettings() {
    return systemSettings;
  },

  getRoutePrefix() {
    return `${apiPrefix}/${apiVersion}`;
  },
};

export default SystemSettingsServices;
