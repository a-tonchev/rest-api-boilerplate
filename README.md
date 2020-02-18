# KOA Rest API Boilerplate with mongodb driver
Boilerplate for Rest API based on node js, KOA and mongo driver with JSON Schema validation (which is native for mongo)

## Installation

```
yarn install
```

## Usage

#### 1. Create a settings.js file - one directory above the project, with similar structure:
```
export default {
	"MONGO_URL": "mongodb://localhost:27017/yourDatabase",
	"dbName": "yourDatabase",
}
```

#### 2. Start server with nodeamon
```
yarn start
```

## Project information

### The boilerplate provides following structure:

```
/lib - the directory with all services that serve the database
/modules - the directory with additional helpers (modules, or services that serve additional purposes)
/startup - files that serve to start the server + basic routes
```

### The boilerplate provides following basic routes:

```
/users/signUp - Sign up with username and password
/users/login - Login with username and password
/users/ownData - get user data for registered user
```
### The boilerplate provides all services in the ctx object:

ctx.db - the mongodb
ctx.appDb - the mongodb collections, prepared for mongo queries (e.g. ctx.appDb.users or ctx.appDb.products etc...)
ctx.libServices - All services/library that serve the collections
ctx.modServices - All services/modules that serve different purposes

### Each route request have following steps (managed by the own route-creator):

#### 1. Authentication

To check if the user has necessary Authentication

#### 2. Authorization

Check if user have the correct rights

#### 3. Validation

Check if user have provided the required parameters for the request

#### 4. Handler

Handle and process the request

##### Example:

```
import createBasicRoutes from '../../../modules/routing/RouteCreator';
import UserController from './UserController';

const UserRoutes = createBasicRoutes(
  {
    prefix: '/users',
    routeData: [
      {
        method: 'all',
        path: '/',
        handler: UserController.somePublicFunction(),
      },
      {
        method: 'get',
        path: '/ownData',
        authentication: true, //if true, user should be logged in.
        authorization: AuthorizeUser(),
        validation: ValidateUserRequest(),
        handler: HandleRequestedData(),
      },
...
    ],
  },
);
```

### After login user receives a token and start session in the "authentications" collection in mongodb, 
which tokens availability is updated on each request and is valid only for 2 days after last activity of the user

If token provided by the frontends header ("Baerer {{token}}") then the server set the user in ctx.user

### Additional:

#### Why mongodb driver and not mongoose?

In mongoose models are coupled to the database, and using/validating a Model must be in an environment that can access the database. Also, mongoose schema functions (statics/virtuals, etc.) tend to put the business/application logic for handling/manipulating the data on mongoose/mongo, instead of in a service or model layer, which is a tight coupling that will eventually bite at scale.

Also as of Mongo 3.6 you can use draft-4 of the JSON Schema spec directly in Mongo. 

In the project we use the package 'ajv' to validate the parameters before we give them try into the database.

The project is using also custom db-connection pool based on "generic-pool", so that we don't need to create connection on each request
