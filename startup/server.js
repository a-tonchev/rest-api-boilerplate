import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { userAgent } from 'koa-useragent';
import cors from '@koa/cors';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';
import mongoPool from '#modules/db/mongoPool';
import UserAuthentications from '#lib/users/services/UserAuthentications';
import servicePool from '#modules/services/servicePool';

import routers from './routes/routes';

const settingsToUse = SystemSettingsServices.getSettings();

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
  // TODO - need to be reported later
  console.warn('Error message: ', err.message);
  console.warn('Error code: ', ctx.status);
  console.warn('Error delivered: ', ctx.body);
  if (ctx.state.realError) {
    console.warn('Real Error: ', ctx.state.realError);
  }
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
