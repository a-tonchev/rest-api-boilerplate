import createBasicRoutes from '#modules/routing/createRoutes';
import AuthorizationCheck from '#modules/authorization/AuthorizationCheck';

import UserController from './UserController';
import UserValidations from '../services/UserValidations';

const UserRoutes = createBasicRoutes(
  {
    prefix: '/users',
    routeData: [
      // Main user route
      {
        method: 'post',
        path: '/all',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        handler: UserController.getAll,
      },
      {
        method: 'post',
        path: '/getByClientNumber',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: UserValidations.validateGetByClientNumber,
        handler: UserController.getByClientNumber,
      },
      {
        method: 'post',
        path: '/update',
        authentication: true,
        authorization: AuthorizationCheck.isAdmin,
        validation: UserValidations.validateUpdateUser,
        handler: UserController.updateUser,
      },
      {
        method: 'post',
        path: '/sendVerification',
        validation: UserValidations.validateSendVerification,
        handler: UserController.sendVerification,
      },
      {
        method: 'post',
        path: '/ownProfile',
        authentication: true,
        handler: UserController.getOwnProfile,
      },
      {
        method: 'post',
        path: '/updateOwnProfile',
        authentication: true,
        validation: UserValidations.validateUpdateProfile,
        handler: UserController.updateOwnProfile,
      },
      {
        method: 'post',
        path: '/signUp',
        validation: UserValidations.validateSignUp,
        handler: UserController.signUp,
      },
      {
        method: 'post',
        path: '/verify',
        validation: UserValidations.validateVerify,
        handler: UserController.verify,
      },
      {
        method: 'post',
        path: '/resetRequest',
        validation: UserValidations.validateResetRequest,
        handler: UserController.resetRequest,
      },
      {
        method: 'post',
        path: '/resetPassword',
        validation: UserValidations.validateResetPassword,
        handler: UserController.resetPassword,
      },
      {
        method: 'post',
        path: '/updatePassword',
        authentication: true,
        validation: UserValidations.validateUpdatePassword,
        handler: UserController.updatePassword,
      },
      {
        method: 'post',
        path: '/login',
        validation: UserValidations.validateLogin,
        handler: UserController.login,
      },
      {
        method: 'post',
        path: '/logout',
        authentication: true,
        handler: UserController.logout,
      },
    ],
  },
);

export default UserRoutes;
