import Router from 'koa-router';

import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';

import DefaultRoute from './DefaultRoute';
import { Config } from '../../src/Config';

const apiRouter = new Router({
  prefix: SystemSettingsServices.getRoutePrefix(),
});

const libRoutes = Config.collections.filter(col => col.routes).map(c => c.routes);

const routes = [DefaultRoute, ...libRoutes];

routes.forEach(router => {
  apiRouter.use(router.routes(), router.allowedMethods());
});

// console.log('Available routes:');
// console.log(apiRouter.stack.map(i => i.path));

export default apiRouter;
