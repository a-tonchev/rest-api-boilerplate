export default {
  local: {
    MONGO_URL: 'mongodb://localhost:27017/rest-api-boilerplate',
    dbName: 'rest-api-boilerplate',
    apiPrefix: '/api',
    apiVersion: 'v1',
    maxBodyBytes: 1024 * 1024, // max JSON request body size in bytes (default 1 MB)
    debug: true,
    disableEmail: true,
    frontendUrl: 'http://localhost:3000',
    email: {
      from: 'no-reply@myapp.com',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    },
  },
  staging: {
    MONGO_URL: 'mongodb://localhost:27017/rest-api-boilerplate',
    dbName: 'rest-api-boilerplate',
    apiPrefix: '/api',
    apiVersion: 'v1',
    maxBodyBytes: 1024 * 1024, // max JSON request body size in bytes (default 1 MB)
    frontendUrl: 'https://staging.myapp.com',
    email: {
      from: 'no-reply@myapp.com',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    },
  },
  production: {
    MONGO_URL: 'mongodb://localhost:27017/rest-api-boilerplate',
    dbName: 'rest-api-boilerplate',
    apiPrefix: '/api',
    apiVersion: 'v1',
    maxBodyBytes: 1024 * 1024, // max JSON request body size in bytes (default 1 MB)
    frontendUrl: 'https://myapp.com',
    email: {
      from: 'no-reply@myapp.com',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    },
  },
};
