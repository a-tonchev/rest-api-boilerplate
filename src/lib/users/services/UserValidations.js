import UserSchemaFields from '../schema/UserSchemaFields';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

export default class UserValidations {
  static async validateSignUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedSchema = ctx.helpers.validations.prepareForParamsValidation(UserSchemaFields);
    const valid = ctx.helpers.validations.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: preparedSchema.email,
        password: preparedSchema.password,
      },
    });
    const { createValidateError, CustomErrors } = ctx.helpers.responses;
    createValidateError(
      !await ctx.services.users.getByEmail(email),
      ctx,
      CustomErrors.USER_ALREADY_EXISTS,
    );
    return valid;
  }

  static async validateLogin(ctx) {
    const { email, password } = ctx.request.body;
    const validations = ctx.helpers.validations.prepareForParamsValidation(CommonSchemaFields);
    return ctx.helpers.validations.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: validations.basicString,
        password: validations.basicString,
      },
    });
  }
}
