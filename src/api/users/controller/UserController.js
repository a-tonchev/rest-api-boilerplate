import {
  createSuccessResponse,
  createErrorResponse,
  createValidateError,
} from '../../../modules/responseHandler/responses';
import CustomErrors from '../../../modules/responseHandler/CustomErrors';
import UserSchema from '../schema/UserSchema';
import AuthenticationSchema from '../../authentications/schema/AuthenticationSchema';
import OnBoardingServices from '../services/OnBoardingServices';
import ValidationServices from '../../../modules/validation/ValidationServices';

export default class UserController {
  static async getAll(ctx) {
    const users = await ctx.services.users.getAll();
    return createSuccessResponse(ctx, {
      users,
    });
  }

  static async getById(ctx) {
    const user = await ctx.services.users.getById(ctx.params.id);
    return createSuccessResponse(ctx, user);
  }

  static async getOwnData(ctx) {
    const user = await ctx.services.users.getById(ctx.state.user._id);
    return createSuccessResponse(ctx, user);
  }

  static async signUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedUser = await OnBoardingServices.prepareUser({ email, password, ctx });
    ValidationServices.validateSchema(ctx, preparedUser, UserSchema);
    try {
      await ctx.services.users.add(preparedUser);
      return createSuccessResponse(ctx);
    } catch (err) {
      if (err.code === 11000) {
        return createErrorResponse(ctx, CustomErrors.USER_ALREADY_EXISTS);
      }
      if (err.code === 121) {
        return createErrorResponse(ctx, CustomErrors.USER_NOT_VALID);
      }
      return createErrorResponse(ctx, CustomErrors.BAD_REQUEST);
    }
  }

  static async login(ctx) {
    const { email, password } = ctx.request.body;
    const user = await ctx.services.users.getByEmailOrClientNumber(email, {});
    const checkPassword = await ctx.services.users.checkPassword(user, password);
    createValidateError(user && checkPassword, ctx, CustomErrors.USER_WRONG_LOGIN_CREDENTIALS);
    const preparedAuthSession = ctx.services.authentications.prepareAuthenticationSession(
      ctx.services.users.getIdAsString(user), ctx,
    );
    ValidationServices.validateSchema(ctx, preparedAuthSession, AuthenticationSchema);
    try {
      const token = await ctx.services.authentications.add(preparedAuthSession);
      return createSuccessResponse(ctx, { token });
    } catch (err) {
      return createErrorResponse(ctx, CustomErrors.BAD_REQUEST);
    }
  }
}
