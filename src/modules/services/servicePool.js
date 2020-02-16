import setupServices from './setupServices';

let appServices;
let appHelpers;

const servicePool = async (ctx, next) => {
  const setup = setupServices(ctx);
  ctx.services = setup.services;
  ctx.helpers = setup.helpers;
  appServices = ctx.services;
  appHelpers = ctx.helpers;
  try {
    await next();
  } finally {
    appServices = null;
    appHelpers = null;
    ctx.services = null;
    ctx.helpers = null;
  }
};

const getServices = (serviceName) => (serviceName ? appServices[serviceName] : appServices);
const getHelpers = (helperName) => (helperName ? appHelpers[helperName] : appHelpers);

export { getServices, getHelpers };
export default servicePool;
