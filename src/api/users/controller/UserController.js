import UserSchema from '../schema/UserSchema';
import AuthenticationSchema from '../../authentications/schema/AuthenticationSchema';

export default class UserController {
  static async getAll(ctx) {
    const users = await ctx.services.users.getAll();
    return ctx.helpers.responses.createSuccessResponse(ctx, {
      users,
    });
  }

  static async getById(ctx) {
    const user = await ctx.services.users.getById(ctx.params.id);
    return ctx.helpers.responses.createSuccessResponse(ctx, user);
  }

  static async getOwnData(ctx) {
    const user = await ctx.services.users.getById(ctx.state.user._id);
    return ctx.helpers.responses.createSuccessResponse(ctx, user);
  }

  static async signUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedUser = await ctx.services.onBoarding.prepareUser({ email, password, ctx });
    ctx.helpers.validations.validateSchema(ctx, preparedUser, UserSchema);
    try {
      await ctx.services.users.add(preparedUser);
      return ctx.helpers.responses.createSuccessResponse(ctx);
    } catch (err) {
      if (err.code === 11000) {
        return ctx.helpers.responses.createErrorResponse(
          ctx,
          ctx.helpers.responses.CustomErrors.USER_ALREADY_EXISTS,
        );
      }
      if (err.code === 121) {
        return ctx.helpers.responses.createErrorResponse(
          ctx,
          ctx.helpers.responses.CustomErrors.USER_NOT_VALID,
        );
      }
      return ctx.helpers.responses.createErrorResponse(
        ctx,
        ctx.helpers.responses.CustomErrors.BAD_REQUEST,
      );
    }
  }

  static async login(ctx) {
    const { email, password } = ctx.request.body;
    const user = await ctx.services.users.getByEmailOrClientNumber(email, {});
    const checkPassword = await ctx.services.users.checkPassword(user, password);
    ctx.helpers.responses.createValidateError(
      user && checkPassword,
      ctx,
      ctx.helpers.responses.CustomErrors.USER_WRONG_LOGIN_CREDENTIALS,
    );
    const preparedAuthSession = ctx.services.authentications.prepareAuthenticationSession(
      ctx.services.users.getIdAsString(user), ctx,
    );
    ctx.helpers.validations.validateSchema(ctx, preparedAuthSession, AuthenticationSchema);
    try {
      const token = await ctx.services.authentications.add(preparedAuthSession);
      return ctx.helpers.responses.createSuccessResponse(ctx, { token });
    } catch (err) {
      return ctx.helpers.responses.createErrorResponse(
        ctx,
        ctx.helpers.responses.CustomErrors.BAD_REQUEST,
      );
    }
  }
}
