import uWebSockets from 'uWebSockets.js';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';
import mongoPool from '#modules/db/mongoPool';

import setupFaviconRoute from './routes/setup/setupFaviconRoute';
import setupMainRoute from './routes/setup/setupMainRoute';
import setupRouteHandlers from './routes/setup/setupRouteHandlers';
import setupNotFoundRoute from './routes/setup/setupNotFoundRoute';

const settingsToUse = SystemSettingsServices.getSettings();

const mongoSetup = mongoPool({
  uri: settingsToUse.MONGO_URL,
  dbName: settingsToUse.dbName,
  max: 500,
  min: 1,
});

const port = Number(process.env.PORT || 5001);

const app = uWebSockets.App();

setupFaviconRoute(app);

setupMainRoute(app);

setupRouteHandlers(app, mongoSetup);

setupNotFoundRoute(app);

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
