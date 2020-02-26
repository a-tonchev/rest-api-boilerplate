import { setupLibs, setupMods } from './setupServices';

let modServices;
let libServices;

class servicePool {
  static async setupModServices(ctx, next) {
    ctx.modS = setupMods();
    modServices = ctx.modS;

    try {
      await next();
    } finally {
      modServices = null;
      ctx.modS = null;
    }
  }

  static async setupLibServices(ctx, next) {
    ctx.libS = setupLibs(ctx);

    libServices = ctx.libS;
    try {
      await next();
    } finally {
      libServices = null;
      ctx.libS = null;
    }
  }
}

const getModS = (serviceName) => (serviceName ? modServices[serviceName] : modServices);
const getLibS = (serviceName) => (serviceName ? libServices[serviceName] : libServices);

export { getModS, getLibS };
export default servicePool;
