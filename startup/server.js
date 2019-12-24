import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { userAgent } from 'koa-useragent';

import mongoPool from '../src/modules/db/mongoPool';
import routes from './routes/routes';
import settings from '../../settings';
import UserAuthentications from '../src/api/users/services/UserAuthentications';

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
  console.warn('Error occurs: ', err.message);
  console.warn('Error code: ', ctx.status);
  console.log(err);
});

app.use(userAgent);

app.use(mongoPool({
  uri: settings.MONGO_URL,
  dbName: settings.dbName,
}));

app.use(UserAuthentications.setupAuthentication);

app.use(bodyParser());

routes.forEach(route => app.use(route.routes()));

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
