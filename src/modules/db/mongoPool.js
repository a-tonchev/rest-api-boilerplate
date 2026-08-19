import mongodb from 'mongodb';

import LogServices from '#modules/logging/LogServices';

import setupCollections from './setupCollections';
import setupDatabase from './setupDatabase';

const { MongoClient } = mongodb;

let databasesEnsured = false;

const mongoPool = connOptions => {
  const { uri: mongoUrl, dbName } = connOptions;

  let client;

  try {
    client = new MongoClient(mongoUrl, {
      // 500 was 5x the driver default with no measured benefit on a single
      // event-loop thread. 100 is a realistic ceiling; timeouts below make sure
      // a dead Mongo sheds load fast instead of pinning request contexts.
      maxPoolSize: 100,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      waitQueueTimeoutMS: 5000,
      maxIdleTimeMS: 300000,
    });
  } catch (e) {
    // Fail fast: returning null previously surfaced as a confusing
    // "mongoSetup is not a function" on the first request instead of at boot.
    console.error(e);
    throw e;
  }

  // Connect and ensure schema/collection/index setup completes BEFORE the server
  // is allowed to accept traffic (server.js awaits `ready`). Requests hitting
  // half-built collections/indexes was a startup race.
  const ensureDatabases = async () => {
    await client.connect();

    if (!databasesEnsured) {
      LogServices.warn('Ensuring databases and collections (indexes, validations)...');
      const mDb = client.db(dbName);
      await setupCollections(mDb);
      // Set the flag only AFTER success so a failed boot can retry.
      databasesEnsured = true;
      LogServices.success('Ensuring done');
    }
  };

  const ready = ensureDatabases();

  const mongoSetup = async ctx => {
    ctx.mongo = client;

    ctx.modS.responses.createValidateError(
      ctx.mongo,
      ctx,
      ctx.modS.responses.CustomErrors.SERVER_TIMEOUT,
    );

    ctx.mongoDb = ctx.mongo.db(dbName);
    ctx.db = setupDatabase(ctx.mongoDb);
    // `ctx.privateState` is owned by setupContext; do not reset it here (that
    // clobbered auth state depending on pipeline ordering).
  };

  const closeClient = () => client.close();

  return { mongoSetup, ready, closeClient };
};

export default mongoPool;
