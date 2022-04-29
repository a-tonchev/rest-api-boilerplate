import uWebSockets from 'uWebSockets.js';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';
import mongoPool from '#modules/db/mongoPool';
import UserAuthentications from '#lib/users/services/UserAuthentications';
import servicePool from '#modules/services/servicePool';

import routes from './routes/routes';
import setupContext from './startupHelpers/setupContext';
import onError from './startupHelpers/onError';

const settingsToUse = SystemSettingsServices.getSettings();

const mongoSetup = mongoPool({
  uri: settingsToUse.MONGO_URL,
  dbName: settingsToUse.dbName,
  max: 500,
  min: 1,
});

const port = process.env.PORT || 5001;

const app = uWebSockets.App();

app.any('/favicon.icon', res => {
  res.writeStatus('200').end('');
});

app.any('/', res => {
  res.writeStatus('200').end('Welcome To The API!');
});

routes.forEach(route => {
  const { path, method, steps } = route;
  app[method](path, (res, req) => {
    res.onAborted(() => {
      console.error('ABORTED!');
    });

    (async () => {
      let ctx = await setupContext(req, res);

      const finishArray = [];
      const addOnFinish = newFunc => finishArray.unshift(newFunc);

      try {
        await servicePool.setupModServices(ctx);
        await mongoSetup(ctx, addOnFinish);
        await servicePool.setupLibServices(ctx);
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
        };

        onError(err, ctx);
      }

      res.writeStatus(`${ctx.status || 400}`).end(
        typeof ctx.body === 'object' ? JSON.stringify(ctx.body) : ctx.body,
      );

      // Clean up functions
      finishArray.forEach(func => func());
      ctx = null;
    })();
  });
});

app.any('/*', res => {
  res.writeStatus('404').end('Route does not exist!');
});

app.listen(port, listenSocket => {
  if (listenSocket) {
    if (process.env.npm_lifecycle_event === 'start-dev') {
      console.info('Start in DEVELOPMENT mode');
    } else if (!process.env.environment || process.env.environment === 'local') {
      console.info('\x1b[1m', '\x1b[33m');
      console.warn('Please use the command \'yarn start-dev\' if you intend to develop on the project');
      console.warn('\x1b[0m');
      console.info('Start in PRODUCTION mode');
    } else {
      console.info('Start in PRODUCTION mode');
    }
    console.info(`Server running on port ${port}`);
  }
});
