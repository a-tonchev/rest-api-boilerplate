import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { userAgent } from 'koa-useragent';
import mongoPool from '../src/modules/db/mongoPool';
import routers from './routes/routes';
import UserAuthentications from '../src/lib/users/services/UserAuthentications';
import servicePool from '../src/modules/services/servicePool';
import SettingsServices from '../src/modules/settings/SettingsServices';

const settingsToUse = SettingsServices.getSettings();

const app = new Koa();
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
  console.log(`Server running on port ${port}`);
});
