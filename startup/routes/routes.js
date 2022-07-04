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

export default routes;
