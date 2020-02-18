import setupServices from './setupServices';

let libServices;
let modServices;

const servicePool = async (ctx, next) => {
  const setup = setupServices(ctx);
  ctx.libServices = setup.libServices;
  ctx.modServices = setup.modServices;
  libServices = ctx.libServices;
  modServices = ctx.modServices;
  try {
    await next();
  } finally {
    libServices = null;
    modServices = null;
    ctx.libServices = null;
    ctx.modServices = null;
  }
};

const getLibServices = (serviceName) => (serviceName ? libServices[serviceName] : libServices);
const getModServices = (serviceName) => (serviceName ? modServices[serviceName] : modServices);

export { getLibServices, getModServices };
export default servicePool;
