import { Config } from '../../Config';

const servicePool = {
  async setupModServices(ctx, addOnFinish) {
    ctx.modS = Config.setupMods();

    addOnFinish(() => {
      ctx.modS = null;
    });
  },

  async setupLibServices(ctx, addOnFinish) {
    ctx.libS = Config.setupLibs(ctx);

    addOnFinish(() => {
      ctx.libS = null;
    });
  },
};

export default servicePool;
