import UserServices from '../services/UserServices';
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
import AuthenticationServices from '../../authentications/services/AuthenticationServices';

export default class UserController {
  static async getAll(ctx) {
    const users = await UserServices.getAll();
    return createSuccessResponse(ctx, {
      users,
    });
  }

  static async getById(ctx) {
    const user = await UserServices.getById(ctx.params.id);
    return createSuccessResponse(ctx, user);
  }

  static async getOwnData(ctx) {
    const user = await UserServices.getById(ctx.state.user._id);
    return createSuccessResponse(ctx, user);
  }

  static async signUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedUser = await OnBoardingServices.prepareUser({ email, password });
    ValidationServices.validateSchema(ctx, preparedUser, UserSchema);
    try {
      await UserServices.add(preparedUser);
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
    const user = await UserServices.getByEmailOrClientNumber(email, {});
    const checkPassword = await UserServices.checkPassword(user, password);
    createValidateError(user && checkPassword, ctx, CustomErrors.USER_WRONG_LOGIN_CREDENTIALS);
    const preparedAuthSession = AuthenticationServices.prepareAuthenticationSession(
      UserServices.getIdAsString(user), ctx,
    );
    ValidationServices.validateSchema(ctx, preparedAuthSession, AuthenticationSchema);
    try {
      const token = await AuthenticationServices.add(preparedAuthSession);
      return createSuccessResponse(ctx, { token });
    } catch (err) {
      return createErrorResponse(ctx, CustomErrors.BAD_REQUEST);
    }
  }
}
