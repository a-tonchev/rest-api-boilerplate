import createBasicRoutes from '../../../modules/routing/RouteCreator';
import UserController from './UserController';
import UserValidations from '../services/UserValidations';

const UserRoutes = createBasicRoutes(
  {
    prefix: '/users',
    routeData: [
      // Main user route
      {
        method: 'all',
        path: '/',
        handler: UserController.getAll,
      },
      {
        method: 'get',
        path: '/all',
        handler: UserController.getAll,
      },
      {
        method: 'get',
        path: '/ownData',
        authentication: true,
        handler: UserController.getOwnData,
      },
      {
        method: 'post',
        path: '/signUp',
        validation: UserValidations.validateSignUp,
        handler: UserController.signUp,
      },
      {
        method: 'post',
        path: '/login',
        validation: UserValidations.validateLogin,
        handler: UserController.login,
      },
    ],
  },
);

export default UserRoutes;
