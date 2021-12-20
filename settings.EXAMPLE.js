export default {
  local: {
    MONGO_URL: 'mongodb://localhost:27017/koa-rest-mongo',
    dbName: 'koa-rest-mongo',
    apiPrefix: '/api',
    apiVersion: 'v1',
    debug: true,
  },
  staging: {
    MONGO_URL: 'mongodb://localhost:27017/koa-rest-mongo',
    dbName: 'koa-rest-mongo',
    apiPrefix: '/api',
    apiVersion: 'v1',
  },
  production: {
    MONGO_URL: 'mongodb://localhost:27017/koa-rest-mongo',
    dbName: 'koa-rest-mongo',
    apiPrefix: '/api',
    apiVersion: 'v1',
  },
};
