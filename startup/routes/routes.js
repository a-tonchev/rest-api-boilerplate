import Router from 'koa-router';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';
import UserRoutes from '#lib/users/controller/UserRoutes';

import DefaultRoute from './DefaultRoute';

const apiRouter = new Router({
  prefix: SystemSettingsServices.getRoutePrefix(),
});

const routes = [DefaultRoute, UserRoutes];

routes.forEach(router => {
  apiRouter.use(router.routes(), router.allowedMethods());
});

// console.log('Available routes:');
// console.log(apiRouter.stack.map(i => i.path));

export default apiRouter;
