import UserSchema from '../schema/UserSchema';
import AuthenticationSchema from '../../authentications/schema/AuthenticationSchema';

export default class UserController {
  static async getAll(ctx) {
    const users = await ctx.libS.users.getAll();
    return ctx.modS.responses.createSuccessResponse(ctx, {
      users,
    });
  }

  static async getById(ctx) {
    const user = await ctx.libS.users.getById(ctx.params.id);
    return ctx.modS.responses.createSuccessResponse(ctx, user);
  }

  static async getOwnData(ctx) {
    const user = await ctx.libS.users.getById(ctx.state.user._id);
    return ctx.modS.responses.createSuccessResponse(ctx, user);
  }

  static async signUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedUser = await ctx.libS.onBoarding.prepareUser({ email, password, ctx });
    ctx.modS.validations.validateSchema(ctx, preparedUser, UserSchema);
    try {
      await ctx.libS.users.add(preparedUser);
      return ctx.modS.responses.createSuccessResponse(ctx);
    } catch (err) {
      if (err.code === 11000) {
        return ctx.modS.responses.createErrorResponse(
          ctx,
          ctx.modS.responses.CustomErrors.USER_ALREADY_EXISTS,
        );
      }
      if (err.code === 121) {
        return ctx.modS.responses.createErrorResponse(
          ctx,
          ctx.modS.responses.CustomErrors.USER_NOT_VALID,
        );
      }
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.BAD_REQUEST,
      );
    }
  }

  static async login(ctx) {
    const { email, password } = ctx.request.body;
    const user = await ctx.libS.users.getByEmailOrClientNumber(email, {});
    const checkPassword = await ctx.libS.users.checkPassword(user, password);
    ctx.modS.responses.createValidateError(
      user && checkPassword,
      ctx,
      ctx.modS.responses.CustomErrors.USER_WRONG_LOGIN_CREDENTIALS,
    );
    const preparedAuthSession = ctx.libS.authentications.prepareAuthenticationSession(
      ctx.libS.users.getIdAsString(user), ctx,
    );
    ctx.modS.validations.validateSchema(ctx, preparedAuthSession, AuthenticationSchema);
    try {
      const token = await ctx.libS.authentications.add(preparedAuthSession);
      return ctx.modS.responses.createSuccessResponse(ctx, { token });
    } catch (err) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.BAD_REQUEST,
      );
    }
  }
}
