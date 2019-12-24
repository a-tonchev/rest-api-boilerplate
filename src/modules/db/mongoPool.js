import { MongoClient } from 'mongodb';
import genericPool from 'generic-pool';
import setupCollections from './setupCollections';

let pDB;

function mongoPool(connOptions, confOptions = {}) {
  const mongoUrl = connOptions.uri;
  const mongoDB = connOptions.dbName;
  const genPool = genericPool.createPool({
    create: () => MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...confOptions,
    })
      .then(client => client)
      .catch(err => {
        throw err;
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
    ctx.db = ctx.mongo.db(mongoDB);
    pDB = ctx.db;
    await setupCollections(pDB);
    try {
      await next();
    } finally {
      await release(ctx.mongo);
    }
  };
}

const getDb = () => pDB;

export { getDb };
export default mongoPool;
