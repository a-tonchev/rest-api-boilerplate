import Router from 'koa-router';

import UserRoutes from '../../src/lib/users/controller/UserRoutes';
import DefaultRoute from './DefaultRoute';

const apiRouter = new Router();

const routes = [DefaultRoute, UserRoutes];

routes.forEach(router => {
  apiRouter.use(router.routes(), router.allowedMethods());
});

// console.log('Available routes:');
// console.log(apiRouter.stack.map(i => i.path));

export default apiRouter;
