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

  static async getByClientNumber(ctx) {
    const { clientNumber } = ctx.request.body;
    const user = await ctx.libS.users.getByClientNumber(
      clientNumber,
      {
        projection: {
          services: 0,
        },
      },
    );
    return ctx.modS.responses.createSuccessResponse(ctx, {
      user,
    });
  }

  static async getOwnProfile(ctx) {
    const user = await ctx.libS.users.getById(ctx.state.user._id);
    return ctx.modS.responses.createSuccessResponse(ctx, {
      profile: user.profile,
      email: user.email.address,
      clientNumber: user.clientNumber,
    });
  }

  static async sendVerification(ctx) {
    const { email } = ctx.request.body;
    const {
      createErrorResponse,
      CustomErrors,
      createSuccessResponse,
    } = ctx.modS.responses;
    const user = await ctx.libS.users.getByEmail(email, {});
    const { lastVerificationSent } = user.services.email;
    if (
      lastVerificationSent
      && ctx.modS.date.getBefore({ minutes: 1 }) < lastVerificationSent
    ) {
      createErrorResponse(ctx, CustomErrors.USER_REQUEST_TOO_OFTEN);
    }
    await ctx.libS.users.updateLastVerificationSent(user._id);
    const verificationToken = ctx.libS.users.getVerificationToken(user);
    const mailSettings = ctx.modS.email.getMailSettings(ctx);
    ctx.modS.email.sendVerificationMail(mailSettings, email, verificationToken).then();
    return createSuccessResponse(ctx);
  }

  static async signUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedUser = await ctx.libS.users.onBoarding.prepareUser({ email, password, ctx });
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

  static async updateUser(ctx) {
    const {
      clientNumber, status, roles, discounts,
    } = ctx.state.userFields;
    try {
      await ctx.libS.users.updateByClientNumber(
        clientNumber,
        {
          status,
          roles,
          discounts,
        },
      );
      return ctx.modS.responses.createSuccessResponse(ctx);
    } catch (err) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.BAD_REQUEST,
        {},
        err,
      );
    }
  }

  static async updateOwnProfile(ctx) {
    const { profile } = ctx.request.body;
    const userId = ctx.state.user._id;

    await ctx.libS.users.updateProfile(
      userId,
      profile,
    );

    return ctx.modS.responses.createSuccessResponse(ctx);
  }

  static async resetRequest(ctx) {
    const { user } = ctx.state;

    const resetToken = ctx.modS.string.generateToken(32);
    await ctx.libS.users.addResetToken(user.clientNumber, resetToken);
    const mailSettings = ctx.modS.email.getMailSettings(ctx);
    const sendMail = await ctx.modS.email.sendPasswordReset(
      mailSettings,
      ctx.libS.users.getEmail(user),
      resetToken,
    );

    ctx.modS.responses.createValidateError(
      sendMail,
      ctx,
      ctx.modS.responses.CustomErrors.EMAIL_CAN_NOT_BE_SEND,
    );
    return ctx.modS.responses.createSuccessResponse(ctx);
  }

  static async resetPassword(ctx) {
    const { user, password } = ctx.state;
    try {
      await ctx.libS.users.resetPassword(user.clientNumber, password);
      const mailSettings = ctx.modS.email.getMailSettings(ctx);
      ctx.modS.email.sendPasswordResetSuccess(
        mailSettings,
        ctx.libS.users.getEmail(user),
      ).then();
      return ctx.modS.responses.createSuccessResponse(ctx);
    } catch (err) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.BAD_REQUEST,
        {},
        err,
      );
    }
  }

  static async updatePassword(ctx) {
    const { user, password } = ctx.state;
    try {
      await ctx.libS.users.updatePassword(user.clientNumber, password);
      return ctx.modS.responses.createSuccessResponse(ctx);
    } catch (err) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.BAD_REQUEST,
        {},
        err,
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

  static async logout(ctx) {
    if (ctx.state.logoutUser) {
      await ctx.state.logoutUser();
    }
    return ctx.modS.responses.createSuccessResponse(ctx);
  }
}
