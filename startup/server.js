import websocketJs from 'uWebSockets.js';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';
import mongoPool from '#modules/db/mongoPool';
import UserAuthentications from '#lib/users/services/UserAuthentications';
import servicePool from '#modules/services/servicePool';

import { routes } from './routes/routes';

const settingsToUse = SystemSettingsServices.getSettings();

const onError = (err, ctx) => {
  if (!settingsToUse?.debug && ctx.status !== 500) return;
  // TODO - need to be reported later, maybe in DB or via api
  console.warn('Error MESSAGE: ', err.message);
  console.warn('Error CODE: ', ctx.status);
  console.warn('Error DELIVERED: ', ctx.body);
  if (ctx.privateState?.realError) {
    console.warn('REAL ERROR: ', ctx.privateState.realError);
  }
  console.warn('Error STACK: ', err.stack);
};

const mongoSetup = mongoPool({
  uri: settingsToUse.MONGO_URL,
  dbName: settingsToUse.dbName,
  max: 500,
  min: 1,
});

/* Helper function for reading a posted JSON body */
const readJson = res => new Promise((resolve, reject) => {
  let buffer;
  /* Register data cb */
  res.onData((ab, isLast) => {
    const chunk = Buffer.from(ab);
    if (isLast) {
      let json;
      if (buffer) {
        try {
          json = JSON.parse(Buffer.concat([buffer, chunk]));
          resolve(json);
        } catch (e) {
          reject(e);
        }
      } else {
        try {
          json = JSON.parse(chunk);
          resolve(json);
        } catch (e) {
          resolve({});
        }
      }
    } else if (buffer) {
      buffer = Buffer.concat([buffer, chunk]);
    } else {
      buffer = Buffer.concat([chunk]);
    }
  });
});

const port = process.env.PORT || 5001;

const app = websocketJs.App();

class ContextError extends Error {
  constructor(errorData, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContextError);
    }

    this.name = 'ContextError';
    // Custom debugging information
    this.errorData = errorData;
    this.date = new Date();
  }
}

routes.forEach(route => {
  const { path, method, steps } = route;
  app[method](path, (res, req) => {
    res.onAborted(() => {
      console.error('ABORTED!');
    });

    if (req.getUrl() === '/favicon.icon') {
      res.writeStatus('200').end('');
    } else {
      (async () => {
        const ctx = {
          privateState: {
            user: null,
          },
          state: {

          },
          body: '',
          request: {
            header: {},
            body: {},
          },
          throw: errorData => {
            throw new ContextError(errorData);
          },
        };

        req.forEach((k, v) => {
          ctx.request.header[k] = v;
        });

        ctx.request.body = await readJson(res);

        const finishArray = [];
        const addOnFinish = newFunc => finishArray.push(newFunc);

        try {
          await servicePool.setupModServices(ctx, addOnFinish);
          await mongoSetup(ctx, addOnFinish);
          await servicePool.setupLibServices(ctx, addOnFinish);
          await UserAuthentications.setupAuthentication(ctx, addOnFinish);

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

        finishArray.forEach(func => func());
      })();
    }
  });
});

app.any('/*', res => {
  res.writeStatus('404').end('Route does not exist!');
});

/*
app.any('/*', (res, req) => {
  res.onAborted(() => {
    console.log('ABORTED!');
  });

  if (req.getUrl() === '/favicon.icon') {
    res.writeStatus('200').end('');
  } else {
    (async () => {
      const ctx = {
        privateState: {
          user: null,
        },
        state: {

        },
        body: '',
        request: {
          header: {},
          body: {},
        },
      };

      req.forEach((k, v) => {
        ctx.request.header[k] = v;
      });

      console.log(req.getMethod());
      console.log(req.getUrl());

      ctx.request.body = await readJson(res);

      console.log(ctx.request.body);
      const finishArray = [];
      const addOnFinish = newFunc => finishArray.push(newFunc);

      try {
        await servicePool.setupModServices(ctx, addOnFinish);
        await mongoSetup(ctx, addOnFinish);
        await servicePool.setupLibServices(ctx, addOnFinish);
        await UserAuthentications.setupAuthentication(ctx, addOnFinish);

        console.log(ctx.privateState.user);

        ctx.status = '200';
        console.log('TOKEN:', ctx.modS.string.generateToken(15));
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
          ok: err.ok || false,
          data: err.data,
          code: err.code,
        };
        onError(err, ctx);
      }

      console.log('DONE RESPONSE');

      res.writeStatus(`${ctx.status || 400}`).end(
        typeof ctx.body === 'object' ? JSON.stringify(ctx.body) : ctx.body,
      );

      console.log('AFTER RESPONSE DONE', ctx.privateState.user);

      finishArray.forEach(func => func());
    })();
  }
});
*/
app.listen(port, listenSocket => {
  if (listenSocket) {
    if (process.env.npm_lifecycle_event === 'start-dev') {
      console.log('Start in DEVELOPMENT mode');
    } else if (!process.env.environment || process.env.environment === 'local') {
      console.log('\x1b[1m', '\x1b[33m');
      console.warn('Please use the command \'yarn start-dev\' if you intend to develop on the project');
      console.warn('\x1b[0m');
      console.log('Start in PRODUCTION mode');
    } else {
      console.log('Start in PRODUCTION mode');
    }
    console.log(`Server running on port ${port}`);
  }
});

/*
const app = new Koa();

app.use(cors({
  credentials: true,
}));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      ok: err.ok || false,
      data: err.data,
      code: err.code,
    };
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (err, ctx) => {
  if (!settingsToUse?.debug && ctx.status !== 500) return;
  // TODO - need to be reported later, maybe in DB or via api
  console.warn('Error MESSAGE: ', err.message);
  console.warn('Error CODE: ', ctx.status);
  console.warn('Error DELIVERED: ', ctx.body);
  if (ctx.privateState?.realError) {
    console.warn('REAL ERROR: ', ctx.privateState.realError);
  }
  console.warn('Error STACK: ', err.stack);
});

app.use(servicePool.setupModServices);

app.use(userAgent);

app.use(mongoPool({
  uri: settingsToUse.MONGO_URL,
  dbName: settingsToUse.dbName,
  max: 500,
  min: 1,
}));

app.use(servicePool.setupLibServices);

app.use(UserAuthentications.setupAuthentication);

app.use(bodyParser());

app.use(routers.routes());
app.use(routers.allowedMethods());

const port = process.env.PORT || 5001;
app.listen(port, () => {
  if (process.env.npm_lifecycle_event === 'start-dev') {
    console.log('Start in DEVELOPMENT mode');
  } else if (!process.env.environment || process.env.environment === 'local') {
    console.log('\x1b[1m', '\x1b[33m');
    console.warn('Please use the command \'yarn start-dev\' if you intend to develop on the project');
    console.warn('\x1b[0m');
    console.log('Start in PRODUCTION mode');
  } else {
    console.log('Start in PRODUCTION mode');
  }
  console.log(`Server running on port ${port}`);
});
*/
