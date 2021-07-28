import { Config } from '../../Config';

let modServices;
let libServices;

const servicePool = {
  async setupModServices(ctx, next) {
    ctx.modS = Config.setupMods();
    modServices = ctx.modS;

    try {
      await next();
    } finally {
      modServices = null;
      ctx.modS = null;
    }
  },

  async setupLibServices(ctx, next) {
    ctx.libS = Config.setupLibs(ctx);

    libServices = ctx.libS;
    try {
      await next();
    } finally {
      libServices = null;
      ctx.libS = null;
    }
  },
};

const getModS = serviceName => (serviceName ? modServices[serviceName] : modServices);
const getLibS = serviceName => (serviceName ? libServices[serviceName] : libServices);

export { getModS, getLibS };
export default servicePool;
