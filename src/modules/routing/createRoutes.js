import UserAuthentications from '#lib/users/services/UserAuthentications';

const createRoutes = ({ prefix = '', routeData = [] }) => routeData.map(
  routeElement => {
    const {
      method,
      path,
      authentication,
      authorization,
      validation,
      handler,
    } = routeElement;

    return {
      method,
      path: `${prefix}${path}`,
      steps: [
        async ctx => {
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
        },
        // Check user permissions/authorized if needed
        async ctx => {
          const { CustomErrors, createValidateError } = ctx.modS.responses;
          if (authorization) createValidateError(await authorization(ctx), ctx, CustomErrors.USER_NOT_AUTHORIZED);
        },
        // Validate parameters
        async ctx => {
          const { CustomErrors, createValidateError } = ctx.modS.responses;
          if (validation) createValidateError(await validation(ctx), ctx, CustomErrors.BAD_REQUEST);
        },
        // Handle
        async ctx => handler(ctx),
      ],
    };
  },
);

export default createRoutes;
