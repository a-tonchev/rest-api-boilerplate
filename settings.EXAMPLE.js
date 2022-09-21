export default {
  local: {
    MONGO_URL: 'mongodb://localhost:27017/rest-api-boilerplate',
    dbName: 'rest-api-boilerplate',
    apiPrefix: '/api',
    apiVersion: 'v1',
    debug: true,
  },
  staging: {
    MONGO_URL: 'mongodb://localhost:27017/rest-api-boilerplate',
    dbName: 'rest-api-boilerplate',
    apiPrefix: '/api',
    apiVersion: 'v1',
  },
  production: {
    MONGO_URL: 'mongodb://localhost:27017/rest-api-boilerplate',
    dbName: 'rest-api-boilerplate',
    apiPrefix: '/api',
    apiVersion: 'v1',
  },
};
