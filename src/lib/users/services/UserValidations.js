import UserSchemaFields from '../schema/UserSchemaFields';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

export default class UserValidations {
  static async validateSignUp(ctx) {
    const { email, password } = ctx.request.body;
    const valid = ctx.modS.validations.validateSchema(ctx, { email, password }, {
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
    return valid;
  }

  static async validateLogin(ctx) {
    const { email, password } = ctx.request.body;
    return ctx.modS.validations.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: UserSchemaFields.email,
        password: CommonSchemaFields.basicString,
      },
    });
  }
}
