import mongodb from 'mongodb';
import genericPool from 'generic-pool';

import LogServices from '#modules/logging/LogServices';

import setupCollections from './setupCollections';
import setupDatabase from './setupDatabase';

const { MongoClient } = mongodb;
let mongoDb;
let db;

let databasesEnsured = false;

const mongoPool = (connOptions, confOptions = {}) => {
  const { uri: mongoUrl } = connOptions;
  const { dbName } = connOptions;
  const genPool = genericPool.createPool({
    create: () => MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...confOptions,
    }).then(async client => {
      if (!databasesEnsured) {
        databasesEnsured = true;
        LogServices.warn('Ensuring databases and collections (indexes, validations)...');
        const mDb = client.db(dbName);
        await setupCollections(mDb);
        LogServices.success('Ensuring done');
      }
      return client;
    })
      .catch(err => {
        console.error(err);
        return null;
      }),
    destroy: client => client.close(),
  }, connOptions);

  async function release(resource) {
    return resource && genPool.release(resource);
  }

  process.on('SIGINT', function () {
    genPool.drain().then(function () {
      genPool.clear();
      process.exit();
    });
  });

  return async (ctx, addOnFinish) => {
    ctx.mongo = await genPool.acquire();

    ctx.modS.responses.createValidateError(
      ctx.mongo,
      ctx,
      ctx.modS.responses.CustomErrors.SERVER_TIMEOUT,
    );

    ctx.mongoDb = ctx.mongo.db(dbName);
    mongoDb = ctx.mongoDb;
    ctx.db = setupDatabase(ctx.mongoDb);
    db = ctx.db;
    ctx.privateState = {
      user: null,
    };

    addOnFinish(() => {
      release(ctx.mongo).then();
    });
  };
};

const getMongoDb = () => mongoDb;
const getDb = colName => (colName ? db[colName] : db);

export { getMongoDb, getDb };
export default mongoPool;
