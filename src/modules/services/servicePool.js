import { Config } from '../../Config';

const servicePool = {
  async setupModServices(ctx) {
    ctx.modS = Config.setupMods();
  },

  async setupLibServices(ctx) {
    ctx.libS = Config.setupLibs(ctx);
  },
};

export default servicePool;
