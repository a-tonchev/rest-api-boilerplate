import { MongoClient } from 'mongodb';
import genericPool from 'generic-pool';
import setupCollections from './setupCollections';
import setupDatabase from './setupDatabase';

let mongoDb;
let db;

const mongoPool = (connOptions, confOptions = {}) => {
  const { uri: mongoUrl } = connOptions;
  const { dbName } = connOptions;
  const genPool = genericPool.createPool({
    create: () => MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...confOptions,
    }).then(async client => {
      const mDb = client.db(dbName);
      await setupCollections(mDb);
      return client;
    })
      .catch(err => {
        console.log(err);
        return null;
      }),
    destroy: client => client.close(),
  }, connOptions);

  async function release(resource) {
    if (resource && !resource.isConnected()) {
      await genPool.destroy(resource);
    } else {
      await genPool.release(resource);
    }
  }

  return async (ctx, next) => {
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
    try {
      await next();
    } finally {
      ctx.mongoDb = null;
      ctx.db = null;
      await release(ctx.mongo);
    }
  };
};

const getMongoDb = () => mongoDb;
const getDb = colName => (colName ? db[colName] : db);

export { getMongoDb, getDb };
export default mongoPool;
