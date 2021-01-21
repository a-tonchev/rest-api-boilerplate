import Users from './lib/users/Users';
import Authentications from './lib/authentications/Authentications';
import Validations from './modules/validation/Validations';
import {
  createErrorResponse,
  createSuccessResponse,
  createValidateError,
} from './modules/responseHandler/responses';
import CustomErrors from './modules/responseHandler/CustomErrors';
import string from './modules/helpers/StringHelper';
import date from './modules/helpers/DateHelper';
import EmailServices from './modules/email/EmailServices';

class Config {
  // All collections need to be stored here
  static collections = [Users, Authentications];

  // All collections services need to be setup here
  static setupLibs(ctx) {
    const { users } = Users.setupServices(ctx);
    const { authentications } = Authentications.setupServices(ctx);
    return {
      users,
      authentications,
    };
  }

  // All static modules services need to be setup here
  static setupMods() {
    return {
      validations: Validations,
      responses: {
        createSuccessResponse,
        createErrorResponse,
        createValidateError,
        CustomErrors,
      },
      string,
      date,
      email: EmailServices,
    };
  }
}

export { Config };
export default { Config };
