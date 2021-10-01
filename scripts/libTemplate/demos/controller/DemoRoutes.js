import createBasicRoutes from '#modules/routing/createRoutes';
import AuthorizationCheck from '#modules/authorization/AuthorizationCheck';

import ProductsController from './DemoController';
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
        handler: ProductsController.getAll,
      },
      {
        method: 'post',
        path: '/getById',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateGetById,
        handler: ProductsController.getById,
      },
      {
        method: 'post',
        path: '/create',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateCreate,
        handler: ProductsController.create,
      },
      {
        method: 'post',
        path: '/update',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateUpdate,
        handler: ProductsController.update,
      },
      {
        method: 'post',
        path: '/remove',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: DemoValidations.validateRemove,
        handler: ProductsController.remove,
      },
    ],
  },
);

export default DemoRoutes;
