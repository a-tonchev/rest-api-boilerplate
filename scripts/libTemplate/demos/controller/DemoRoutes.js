import createBasicRoutes from '#modules/routing/createRoutes';
import AuthorizationCheck from '#modules/authorization/AuthorizationCheck';

import DemoController from './DemoController';
import DemoValidations from '../services/DemoValidations';

const DemoRoutes = createBasicRoutes(
  {
    prefix: '/demos',
    routeData: [
      {
        method: 'post',
        path: '/all',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        handler: DemoController.getAll,
      },
      {
        method: 'post',
        path: '/getById',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateGetById,
        handler: DemoController.getById,
      },
      {
        method: 'post',
        path: '/create',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateCreate,
        handler: DemoController.create,
      },
      {
        method: 'post',
        path: '/update',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateUpdate,
        handler: DemoController.update,
      },
      {
        method: 'post',
        path: '/remove',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateRemove,
        handler: DemoController.remove,
      },
    ],
  },
);

export default DemoRoutes;
