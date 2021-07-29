import CommonSchemaFields from '#modules/validation/CommonSchemaFields';

import UserSchemaFields from '../schema/UserSchemaFields';
import { UserStatuses } from '../enums/UserEnums';
import UserSchema from '../schema/UserSchema';

const canUserLogin = (ctx, user) => {
  const { services } = user;
  const { security } = services || {};
  const { loginAttempts = 0, lastLoginAttempt } = security || {};
  const {
    CustomErrors,
    createErrorResponse,
  } = ctx.modS.responses;
  if (loginAttempts > 4 && ctx.modS.date.getBefore({ minutes: 15 }) < lastLoginAttempt) {
    return createErrorResponse(ctx, CustomErrors.USER_LOGIN_ATTEMPT_EXCEEDED);
  }
  return true;
};

const UserValidations = {
  async validateSignUp(ctx) {
    const { email, password } = ctx.request.body;
    const { validateSchema } = ctx.modS.validations;

    validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: UserSchemaFields.email,
        password: UserSchemaFields.password,
      },
    });

    const { createValidateError, CustomErrors } = ctx.modS.responses;
    createValidateError(
      !await ctx.libS.users.getByEmail(email),
      ctx,
      CustomErrors.USER_ALREADY_EXISTS,
    );

    ctx.state.user = await ctx.libS.users.helpers.onBoarding.prepareUser({ email, password, ctx });

    ctx.modS.validations.validateSchema(ctx, ctx.state.user, UserSchema);

    return true;
  },

  async validateGetByClientNumber(ctx) {
    const { clientNumber } = ctx.request.body;
    return ctx.modS.validations.validateSchema(ctx, { clientNumber }, {
      bsonType: 'object',
      required: ['clientNumber'],
      properties: {
        clientNumber: UserSchemaFields.clientNumber,
      },
    });
  },

  async validateUpdateUser(ctx) {
    const { body } = ctx.request;
    const {
      ...userFields
    } = body;
    ctx.state.userFields = userFields;
    return ctx.modS.validations.validateSchema(ctx, userFields, {
      bsonType: 'object',
      required: ['clientNumber'],
      properties: {
        clientNumber: UserSchemaFields.clientNumber,
        status: UserSchemaFields.status,
        roles: UserSchemaFields.roles,
      },
    });
  },

  async validateSendVerification(ctx) {
    const { email } = ctx.request.body;
    return ctx.modS.validations.validateSchema(ctx, { email }, {
      bsonType: 'object',
      required: ['email'],
      properties: {
        clientNumber: UserSchemaFields.email,
      },
    });
  },

  async validateVerify(ctx) {
    const { verificationToken } = ctx.request.body;
    const valid = ctx.modS.validations.validateSchema(ctx, { verificationToken }, {
      bsonType: 'object',
      required: ['verificationToken'],
      properties: {
        verificationToken: CommonSchemaFields.requiredString,
      },
    });
    const user = await ctx.libS.users.getUserToVerify(verificationToken);
    if (!user) return false;
    ctx.state.user = user;
    return valid;
  },

  async validateLogin(ctx) {
    const { email, password } = ctx.request.body;
    const valid = ctx.modS.validations.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: CommonSchemaFields.basicString,
        password: CommonSchemaFields.basicString,
      },
    });
    if (!valid) return false;
    const user = await ctx.libS.users.getByEmailOrClientNumber(email, {});
    ctx.modS.responses.createValidateError(
      user,
      ctx,
      ctx.modS.responses.CustomErrors.USER_WRONG_LOGIN_CREDENTIALS,
    );
    if (!user.email.verified) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.USER_NOT_VERIFIED,
      );
    }
    if (user.status !== UserStatuses.ACTIVE) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.USER_NOT_ALLOWED,
      );
    }

    canUserLogin(ctx, user);

    const checkPassword = await ctx.libS.users.helpers.checkPassword(user, password);
    if (!checkPassword) {
      await ctx.libS.users.updateLoginAttempts(user);
      ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.USER_WRONG_LOGIN_CREDENTIALS,
      );
    }
    await ctx.libS.users.resetLoginAttempts(user);
    ctx.state.user = user;
    return true;
  },

  async validateResetRequest(ctx) {
    const { email } = ctx.request.body;
    const valid = ctx.modS.validations.validateSchema(ctx, { email }, {
      bsonType: 'object',
      required: ['email'],
      properties: {
        email: UserSchemaFields.email,
      },
    });
    const user = await ctx.libS.users.getByEmail(email, {});
    const {
      createErrorResponse,
      CustomErrors,
    } = ctx.modS.responses;
    if (!user) return createErrorResponse(ctx, CustomErrors.INVALID_REQUEST);
    if (!ctx.libS.users.helpers.isVerified(user)) createErrorResponse(ctx, CustomErrors.USER_NOT_VERIFIED);
    if (
      user.services?.password?.resetPasswordToken
      && ctx.modS.date.getBefore({ minutes: 1 }) < user.services.password.lastResetRequest
    ) {
      createErrorResponse(ctx, CustomErrors.USER_REQUEST_TOO_OFTEN);
    }
    ctx.state.user = user;
    return valid;
  },

  async validateResetPassword(ctx) {
    const { password, resetToken } = ctx.request.body;
    const valid = ctx.modS.validations.validateSchema(ctx, { password, resetToken }, {
      bsonType: 'object',
      required: ['password'],
      properties: {
        password: UserSchemaFields.password,
        resetToken: CommonSchemaFields.requiredString,
      },
    });
    const {
      createErrorResponse,
      CustomErrors,
    } = ctx.modS.responses;
    const user = await ctx.libS.users.getByResetToken(resetToken, {});
    if (!user) return createErrorResponse(ctx, CustomErrors.INVALID_REQUEST);
    if (!ctx.libS.users.helpers.isVerified(user)) createErrorResponse(ctx, CustomErrors.USER_NOT_VERIFIED);
    ctx.state.user = user;
    ctx.state.resetToken = resetToken;
    ctx.state.password = await ctx.modS.string.generateBcrypt(password);
    return valid;
  },

  async validateUpdatePassword(ctx) {
    const { currentPassword, password } = ctx.request.body;
    const valid = ctx.modS.validations.validateSchema(ctx, { currentPassword, password }, {
      bsonType: 'object',
      required: ['currentPassword', 'password'],
      properties: {
        currentPassword: UserSchemaFields.password,
        password: UserSchemaFields.password,
      },
    });
    const {
      createValidateError,
      CustomErrors,
    } = ctx.modS.responses;
    const { user } = ctx.privateState;
    const checkPassword = await ctx.libS.users.helpers.checkPassword(user, currentPassword);
    createValidateError(
      checkPassword,
      ctx,
      CustomErrors.USER_WRONG_PASSWORD,
    );
    ctx.state.password = await ctx.modS.string.generateBcrypt(password);
    return valid;
  },

  async validateUpdateProfile(ctx) {
    const { prepareProperties, validateSchema } = ctx.modS.validations;
    const profileSchema = UserSchema.properties.profile;
    const {
      profile,
    } = ctx.request.body;
    const validationSchema = prepareProperties(
      profileSchema,
    );
    return validateSchema(ctx, profile, validationSchema);
  },
};

export default UserValidations;
