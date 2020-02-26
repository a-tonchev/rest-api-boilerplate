import UserSchemaFields from '../schema/UserSchemaFields';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

export default class UserValidations {
  static async validateSignUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedSchema = ctx.modS.validations.prepareForParamsValidation(UserSchemaFields);
    const valid = ctx.modS.validations.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: preparedSchema.email,
        password: preparedSchema.password,
      },
    });
    const { createValidateError, CustomErrors } = ctx.modS.responses;
    createValidateError(
      !await ctx.libS.users.getByEmail(email),
      ctx,
      CustomErrors.USER_ALREADY_EXISTS,
    );
    return valid;
  }

  static async validateLogin(ctx) {
    const { email, password } = ctx.request.body;
    const validations = ctx.modS.validations.prepareForParamsValidation(CommonSchemaFields);
    return ctx.modS.validations.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: validations.basicString,
        password: validations.basicString,
      },
    });
  }
}
