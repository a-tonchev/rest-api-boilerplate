# uWS Rest API Boilerplate with mongodb driver
Boilerplate for Rest API based on node js, uWebsockets.JS and mongo driver with JSON Schema validation (which is native for mongo)

## Requirements
- NodeJS > 12
- Yarn > 1.22


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

## Creating new collection service:

```
yarn createLib [libName]
```

the new collection service will be created under:

```
/src/lib/[libName]
```

with all corresponding files and routes

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

```
ctx.mongoDb - The current pool mongo db
ctx.db - The mongodb collections, prepared for mongo queries (e.g. ctx.db.users or ctx.db.products etc...)
ctx.libS - All services/library that serve the collections
ctx.modS - All services/modules that serve different purposes
```

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
import GetAllUsers from './actions/GetAllUsers';
import GetOwnData from './actions/GetOwnData';

const UserRoutes = createBasicRoutes(
  {
    prefix: '/users',
    routeData: [
      {
        method: 'all',
        path: '/',
        handler: GetAllUsers.handler,
      },
      {
        method: 'get',
        path: '/ownData',
        authentication: true, //if true, user should be logged in.
        authorization: AuthorizeUser(),
        validation: GetOwnData.validation,
        handler: GetOwnData.handler,
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

---

# Project Structure & Conventions (UIM/VOLVO)

> Team conventions shared with the frontend boilerplate (`../react-boilerplate`). The Clean Code rules apply to both projects; everything else here is backend-specific.

## Clean Code & Consistency (CCC)

### Best practices
- Keep code as simple as possible; favour proven design patterns.
- Use consistent names — we use **camelCase**.
- Use as few comments as possible (best case: none — the code should explain itself).
- A file should have **max ~500 lines** of code (rare exceptions allowed).
- **Reuse before building**: most needs are already covered by existing services, modules and helpers. Before building a complex feature, discuss it briefly with the team. Always reuse the shared helpers for currency, prices, numbers, rounding, etc.

### Node.js namespacing
1. Always camelCase.
2. **lower case** start: directories, function exports.
3. **Upper case** start: Objects, Enums, Components, Helper Objects.
4. A filename starts lower- or upper-case depending on the name of its exported element.
5. The filename matches the name of its default export.

### File naming
- Helper / service / schema / enum files use the **singular** entity name: `UserServices.js`, `UserSchema.js`, `UserEnums.js`.
- Schema objects are **singular** + a `Schema` suffix → `ProductSchema` (not `ProductsSchema`).
- The DB collection, the service namespaces (`ctx.libS.users`, `ctx.modS.users`) and the entity directory (`/src/lib/users`) all use the **plural** name; so does the entity's main file (`/src/lib/users/Users.js`).

### ESLint & packages
- ESLint enforces consistency and surfaces issues — keep it green.
- New packages: good reputation (many downloads), actively maintained, **small footprint** (check [bundlephobia](https://bundlephobia.com/)), few transitive dependencies. Prefer a small custom solution over a heavy dependency. Periodically run `yarn outdated` / `yarn upgrade` (mind version compatibility).

### Why not TypeScript?
We use plain JavaScript on purpose. For our focus (functionality, performance, fast delivery) TypeScript adds friction: slower development, false errors, slower builds, 3rd-party compatibility issues, larger payloads and harder live debugging. The real wins are covered by **ESLint + a good IDE**.

> **Clean code is not everything.** We follow the Pareto principle — deliver a fast, working, bug-light product first; the customer pays for, and judges, only what they can see. Do it well the first time, then stop — once functionality is 100 % there, avoid endless refactoring "for perfection".

## Architecture — Microservices, not MVC

We do **not** use MVC. Instead every entity is a self-contained micro-service that owns its **DB access, routing and logic**, wired together through the shared system **Context (`ctx`)**.

```
/src/Config.js   – app configuration
/src/lib         – one micro-service per entity (users, authentications, base, …)
/src/modules     – cross-cutting helpers (routing, responseHandler, db, authorization,
                   validation, email, logging, systemSettings, services, helpers)
```

## The Context (`ctx`)

A `ctx` object is created **per request** and carries the central functionality of the whole app:

| Field | Description |
| ----- | ----------- |
| `ctx.mongoDb` | The current pooled MongoDB connection |
| `ctx.db` | MongoDB collections, ready for queries (`ctx.db.users`, `ctx.db.products`, …) |
| `ctx.libS` | All entity services that serve the collections (`ctx.libS.users.someAction`) |
| `ctx.modS` | All modules that serve cross-cutting purposes (`ctx.modS.responses`, …) |
| `ctx.privateState` | **Immutable** per-request state — must not change during the request |
| `ctx.state` | **Mutable** per-request state — the working data of the current request |

`ctx.privateState` examples: `.user` (current user, `null` for guests), `.newUserData` (updated user data to push back to the frontend), `.settings` (system settings), `.logoutUser()` (logs the user out).

`ctx.state` holds anything the request computes — compute once, then reuse:

```js
ctx.state.user = await ctx.libS.users.getById(userId);
if (!ctx.state.user) { /* return an error response */ }
// reuse ctx.state.user in later steps — no need to re-query the DB
```

## Structure of a Service / Entity

Each entity under `/src/lib/<entity>` follows the same layout (example: `users`):

```
/src/lib/users
├── controller/UserController.js   – request handlers
├── controller/UserRoutes.js       – the entity's routes
├── enums/UserEnums.js             – enums / string names used by the entity
├── schema/UserSchema.js           – the entity's DB schema (JSON Schema draft-4)
├── services/UserServices.js       – DB-level actions (ctx.libS.users.someAction)
│                                     + document helpers (ctx.libS.users.helpers.someHelper)
├── services/UserValidations.js    – validations used mostly by the routes
├── setupCollection.js             – collection init: indexes, unique fields, …
├── setupServices.js               – wires up the DB actions
└── Users.js                       – main file: maps the entity's functions & settings
```

Scaffold a new entity with `yarn createLib [libName]` (see *Creating new collection service* above).

## Authentication

- On login a **session** is created in the `authentications` collection; its `_id` is the **token** used by the frontend.
- The token is sent in the header as `Bearer {{token}}`; when it is valid the server sets `ctx.privateState.user` (otherwise it stays `null`).
- Every request updates the session's `lastActivity`. If `lastActivity` is older than **48 hours**, the session is expired and the user must log in again.
- A Mongo **TTL** index removes sessions whose `lastActivity` is older than **6 months**, keeping the collection clean.

## Routing

Routes are built with the `createBasicRoutes` helper (`/src/modules/routing`). Each route runs these steps in order:

| Step | Behaviour |
| ---- | --------- |
| `authentication` | If `true`, the route is **logged-in only**. Throws **401** when unauthenticated → the frontend logs the user out and redirects to `/login`. |
| `authorization` | If a function, it decides whether the user may use the route. Throws **403** when not authorized → the frontend redirects to `/`. |
| `validation` | If a function, it validates the request (e.g. its parameters). A non-`true` result throws an error. |
| `handler` | The main controller function — executes the request and returns the response. |
| `method` | HTTP method (`post`, `get`, `delete`, `put`). We currently use only `post`. |
| `path` | Request path, e.g. `…/api/v1/users/getById`, `…/api/v1/users/getAll`. |

See the `createBasicRoutes` example above.

## Common Error / Success Responses

For consistent responses use the helpers on `ctx.modS.responses` (`/src/modules/responseHandler`):

| Helper | Purpose |
| ------ | ------- |
| `createSuccessResponse` | Build a success response directly |
| `createErrorResponse` | Build an error response directly |
| `createValidateError` | Validate a value; if it is `null` / `false` / `undefined`, return an error response |
| `CustomErrors` | Catalogue of error responses & codes for the two helpers above. Defaults to `CustomErrors.BAD_REQUEST` (status `400`). |

## Database & tooling

- **MongoDB** via the native `mongodb` Node.js driver (no Mongoose — see *Why mongodb driver and not mongoose?* above).
- JSON Schema validation is native to MongoDB (≥ 3.6); each entity's `schema/…Schema.js` defines it, and `ajv` validates request parameters before they reach the DB.
- Recommended DB client: **[NoSQLBooster](https://nosqlbooster.com/downloads)**.
