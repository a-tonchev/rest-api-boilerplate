import {
  createValidateError,
} from '../../../modules/responseHandler/responses';
import CustomErrors from '../../../modules/responseHandler/CustomErrors';
import AuthenticationServices from '../../authentications/services/AuthenticationServices';

export default class UserAuthentications {
  static async checkUserAuthenticated(ctx) {
    const { user } = ctx.state;
    createValidateError(
      user,
      ctx,
      CustomErrors.USER_NOT_AUTHENTICATED,
    );
    return true;
  }

  static async setupAuthentication(ctx, next) {
    const { header } = ctx.request;
    const headerKey = 'Bearer';
    let token;
    let user;
    if (header && header.authorization) {
      const parts = header.authorization.split(' ');
      if (parts.length === 2 && parts[0] === headerKey) {
        token = parts.pop();
      }
    }
    if (token) {
      user = await AuthenticationServices.getUserByToken(token);
      if (user) {
        ctx.state.user = user;
      }
    }
    try {
      await next();
    } finally {
      ctx.state.user = null;
    }
  }
}
