import createBasicRoutes from '#modules/routing/createRoutes';
import AuthorizationCheck from '#modules/authorization/AuthorizationCheck';

import GetAllDemos from './actions/GetAllDemos';
import GetDemoById from './actions/GetDemoById';
import CreateDemo from './actions/CreateDemo';
import UpdateDemo from './actions/UpdateDemo';
import RemoveDemo from './actions/RemoveDemo';

const DemoRoutes = createBasicRoutes(
  {
    prefix: '/demos',
    routeData: [
      {
        method: 'post',
        path: '/all',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        handler: GetAllDemos.handler,
      },
      {
        method: 'post',
        path: '/getById',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: GetDemoById.validation,
        handler: GetDemoById.handler,
      },
      {
        method: 'post',
        path: '/create',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: CreateDemo.validation,
        handler: CreateDemo.handler,
      },
      {
        method: 'post',
        path: '/update',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: UpdateDemo.validation,
        handler: UpdateDemo.handler,
      },
      {
        method: 'post',
        path: '/remove',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: RemoveDemo.validation,
        handler: RemoveDemo.handler,
      },
    ],
  },
);

export default DemoRoutes;
