import UserSchemaFields from '../schema/UserSchemaFields';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

export default class UserValidations {
  static async validateSignUp(ctx) {
    const { email, password } = ctx.request.body;
    const { validateSchema } = ctx.modS.validations;
    const { createValidateError, CustomErrors } = ctx.modS.responses;

    const valid = validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: UserSchemaFields.email,
        password: UserSchemaFields.password,
      },
    });

    createValidateError(
      !await ctx.libS.users.getByEmail(email),
      ctx,
      CustomErrors.USER_ALREADY_EXISTS,
    );
    return valid;
  }

  static async validateLogin(ctx) {
    const { email, password } = ctx.request.body;
    const { validateSchema } = ctx.modS.validations;
    return validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: UserSchemaFields.email,
        password: CommonSchemaFields.basicString,
      },
    });
  }
}
