import UserSchema from '../schema/UserSchema';
import AuthenticationSchema from '../../authentications/schema/AuthenticationSchema';

export default class UserController {
  static async getAll(ctx) {
    const users = await ctx.libServices.users.getAll();
    return ctx.modServices.responses.createSuccessResponse(ctx, {
      users,
    });
  }

  static async getById(ctx) {
    const user = await ctx.libServices.users.getById(ctx.params.id);
    return ctx.modServices.responses.createSuccessResponse(ctx, user);
  }

  static async getOwnData(ctx) {
    const user = await ctx.libServices.users.getById(ctx.state.user._id);
    return ctx.modServices.responses.createSuccessResponse(ctx, user);
  }

  static async signUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedUser = await ctx.libServices.onBoarding.prepareUser({ email, password, ctx });
    ctx.modServices.validations.validateSchema(ctx, preparedUser, UserSchema);
    try {
      await ctx.libServices.users.add(preparedUser);
      return ctx.modServices.responses.createSuccessResponse(ctx);
    } catch (err) {
      if (err.code === 11000) {
        return ctx.modServices.responses.createErrorResponse(
          ctx,
          ctx.modServices.responses.CustomErrors.USER_ALREADY_EXISTS,
        );
      }
      if (err.code === 121) {
        return ctx.modServices.responses.createErrorResponse(
          ctx,
          ctx.modServices.responses.CustomErrors.USER_NOT_VALID,
        );
      }
      return ctx.modServices.responses.createErrorResponse(
        ctx,
        ctx.modServices.responses.CustomErrors.BAD_REQUEST,
      );
    }
  }

  static async login(ctx) {
    const { email, password } = ctx.request.body;
    const user = await ctx.libServices.users.getByEmailOrClientNumber(email, {});
    const checkPassword = await ctx.libServices.users.checkPassword(user, password);
    ctx.modServices.responses.createValidateError(
      user && checkPassword,
      ctx,
      ctx.modServices.responses.CustomErrors.USER_WRONG_LOGIN_CREDENTIALS,
    );
    const preparedAuthSession = ctx.libServices.authentications.prepareAuthenticationSession(
      ctx.libServices.users.getIdAsString(user), ctx,
    );
    ctx.modServices.validations.validateSchema(ctx, preparedAuthSession, AuthenticationSchema);
    try {
      const token = await ctx.libServices.authentications.add(preparedAuthSession);
      return ctx.modServices.responses.createSuccessResponse(ctx, { token });
    } catch (err) {
      return ctx.modServices.responses.createErrorResponse(
        ctx,
        ctx.modServices.responses.CustomErrors.BAD_REQUEST,
      );
    }
  }
}
