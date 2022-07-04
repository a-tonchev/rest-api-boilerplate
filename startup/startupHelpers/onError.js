import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';

const settingsToUse = SystemSettingsServices.getSettings();

const onError = (err, ctx) => {
  if (!settingsToUse?.debug && ctx.status !== 500) return;
  // TODO - need to be reported later, maybe in DB or via api
  console.warn('Error MESSAGE: ', err.message);
  console.warn('Error CODE: ', ctx.status);
  console.warn('Error DELIVERED: ', ctx.body);
  if (ctx.privateState?.realError) {
    console.warn('REAL ERROR: ', ctx.privateState.realError);
  }
  console.warn('Error STACK: ', err.stack);
};

export default onError;
