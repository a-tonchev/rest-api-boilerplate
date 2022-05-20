import servicePool from '#modules/services/servicePool';
import UserAuthentications from '#lib/users/services/UserAuthentications';

import onError from '../../startupHelpers/onError';

const setupServicesAndSteps = async (ctx, mongoSetup, steps) => {
  const finishArray = [];
  const addOnFinish = newFunc => finishArray.unshift(newFunc);

  try {
    servicePool.setupModServices(ctx);
    await mongoSetup(ctx, addOnFinish);
    servicePool.setupLibServices(ctx);
    await UserAuthentications.setupAuthentication(ctx);

    for (const step of steps) {
      // eslint-disable-next-line no-await-in-loop
      await step(ctx);
    }

    ctx.status = '200';
  } catch (err) {
    const {
      statusCode: status,
      body,
    } = err?.errorData || {};

    ctx.status = status || 500;

    ctx.body = body || {
      ok: false,
      data: {},
      code: 500,
    };

    onError(err, ctx);
  }

  return finishArray;
};

export default setupServicesAndSteps;
