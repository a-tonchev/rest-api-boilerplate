import {
  createValidateError,
} from '../../../modules/responseHandler/responses';
import UserSchemaFields from '../schema/UserSchemaFields';
import ValidationServices from '../../../modules/validation/ValidationServices';
import UserServices from './UserServices';
import CustomErrors from '../../../modules/responseHandler/CustomErrors';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

export default class UserValidations {
  static async validateSignUp(ctx) {
    const { email, password } = ctx.request.body;
    const preparedSchema = ValidationServices.prepareForParamsValidation(UserSchemaFields);
    const valid = ValidationServices.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: preparedSchema.email,
        password: preparedSchema.password,
      },
    });
    createValidateError(
      !await UserServices.getByEmail(email),
      ctx,
      CustomErrors.USER_ALREADY_EXISTS,
    );
    return valid;
  }

  static async validateLogin(ctx) {
    const { email, password } = ctx.request.body;
    const validations = ValidationServices.prepareForParamsValidation(CommonSchemaFields);
    const { valid } = ValidationServices.validateSchema(ctx, { email, password }, {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: validations.basicString,
        password: validations.basicString,
      },
    });
    return valid;
  }
}
