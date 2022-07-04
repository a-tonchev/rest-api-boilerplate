import { Config } from '../../Config';

const servicePool = {
  setupModServices(ctx) {
    ctx.modS = Config.setupMods();
  },

  setupLibServices(ctx) {
    ctx.libS = Config.setupLibs(ctx);
  },
};

export default servicePool;
