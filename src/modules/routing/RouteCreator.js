import Router from 'koa-router';
import CustomErrors from '../responseHandler/CustomErrors';

import { createValidateError } from '../responseHandler/responses';

const createBasicRoutes = ({ prefix = '/', routeData = [] }) => {
  const router = new Router({
    prefix,
  });

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
        // Check user login if needed
        async (ctx, next) => {
          if (authentication) createValidateError(await authentication(ctx), ctx, CustomErrors.USER_NOT_AUTHENTICATED);
          return next();
        },
        // Check user permissions if needed
        async (ctx, next) => {
          if (authorization) createValidateError(await authorization(ctx), ctx, CustomErrors.USER_NOT_AUTHORIZED);
          return next();
        },
        // Validate parameters
        async (ctx, next) => {
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
