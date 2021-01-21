import Router from 'koa-router';
import UserAuthentications from '../../lib/users/services/UserAuthentications';

const createBasicRoutes = ({ prefix, routeData = [] }) => {
  const prefixParams = prefix ? { prefix } : {};
  const router = new Router(prefixParams);

  routeData.forEach(
    routeElement => {
      const {
        method,
        path,
        authentication,
        authorization,
        validation,
        handler,
      } = routeElement;
      router[method](
        path,
        // Check user authenticated/logged in if needed
        async (ctx, next) => {
          const { CustomErrors, createValidateError } = ctx.modS.responses;
          const authenticationCheck = typeof authentication === 'function'
            ? await authentication(ctx)
            : authentication;
          if (authenticationCheck) {
            createValidateError(
              await UserAuthentications.isUserAuthenticated(ctx),
              ctx,
              CustomErrors.USER_NOT_AUTHENTICATED,
            );
          }
          return next();
        },
        // Check user permissions/authorized if needed
        async (ctx, next) => {
          const { CustomErrors, createValidateError } = ctx.modS.responses;
          if (authorization) createValidateError(await authorization(ctx), ctx, CustomErrors.USER_NOT_AUTHORIZED);
          return next();
        },
        // Validate parameters
        async (ctx, next) => {
          const { CustomErrors, createValidateError } = ctx.modS.responses;
          if (validation) createValidateError(await validation(ctx), ctx, CustomErrors.BAD_REQUEST);
          return next();
        },
        // Handle
        async ctx => handler(ctx),
      );
    },
  );

  return router;
};

export default createBasicRoutes;
