import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';

import DefaultRoute from './DefaultRoute';
import { Config } from '../../src/Config';

const prefix = SystemSettingsServices.getRoutePrefix();

const prepareWithPrefix = routesArray => routesArray.map(
  r => ({ ...r, path: `${prefix}${r.path}` }),
);

const routes = [...prepareWithPrefix(DefaultRoute)];

Config.collections.forEach(c => {
  if (c.routes?.length) routes.push(...prepareWithPrefix(c.routes));
});

/*
routes.forEach(router => {
  apiRouter.use(router.routes(), router.allowedMethods());
});

console.log('Available routes:');
console.log(apiRouter.stack.map(i => i.path));
*/

export { routes };
export default routes;
