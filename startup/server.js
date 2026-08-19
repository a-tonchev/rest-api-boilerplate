// Install global rejection/exception handlers before anything else can reject.
import './startupHelpers/registerProcessHandlers';

import uWebSockets from 'uWebSockets.js';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';
import mongoPool from '#modules/db/mongoPool';

import setupFaviconRoute from './routes/setup/setupFaviconRoute';
import setupMainRoute from './routes/setup/setupMainRoute';
import setupRouteHandlers from './routes/setup/setupRouteHandlers';
import setupOptionsRoute from './routes/setup/setupOptionsRoute';
import setupNotFoundRoute from './routes/setup/setupNotFoundRoute';

const settingsToUse = SystemSettingsServices.getSettings();

const { mongoSetup, ready, closeClient } = mongoPool({
  uri: settingsToUse.MONGO_URL,
  dbName: settingsToUse.dbName,
});

const port = Number(process.env.PORT || 5001);

const app = uWebSockets.App();

setupFaviconRoute(app);

setupMainRoute(app);

setupRouteHandlers(app, mongoSetup);

// Preflight handler must be registered before the app.any('/*') catch-all.
setupOptionsRoute(app);

setupNotFoundRoute(app);

let listenSocketToken = null;

const start = async () => {
  try {
    // Do not accept traffic until collections/indexes/validators are in place.
    await ready;
  } catch (err) {
    console.error('Database initialization failed, exiting.', err);
    process.exit(1);
    return;
  }

  app.listen(port, listenSocket => {
    if (!listenSocket) {
      console.error(`Failed to listen on port ${port}`);
      process.exit(1);
      return;
    }

    listenSocketToken = listenSocket;

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
  });
};

let shuttingDown = false;

const shutdown = async signal => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.info(`${signal} received, shutting down gracefully.`);

  // Stop accepting new connections first.
  if (listenSocketToken) {
    uWebSockets.us_listen_socket_close(listenSocketToken);
    listenSocketToken = null;
  }

  try {
    await closeClient();
  } catch (err) {
    console.error('Error closing Mongo client during shutdown.', err);
  }

  process.exit(0);
};

['SIGTERM', 'SIGINT'].forEach(sig => process.once(sig, () => shutdown(sig)));

start();
