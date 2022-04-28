import { Config } from '../../Config';

const servicePool = {
  async setupModServices(ctx, addOnFinish) {
    ctx.modS = Config.setupMods();
    console.log('DONE SERVICES');

    addOnFinish(() => {
      console.log('FINISH MODS');
      ctx.modS = null;
    });
  },

  async setupLibServices(ctx, addOnFinish) {
    ctx.libS = Config.setupLibs(ctx);

    addOnFinish(() => {
      console.log('FINISH LIBS');
      ctx.libS = null;
    });
  },
};

export default servicePool;
