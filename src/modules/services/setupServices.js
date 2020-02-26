import UserServices from '../../lib/users/services/UserServices';
import AuthenticationServices from '../../lib/authentications/services/AuthenticationServices';
import OnBoardingServices from '../../lib/users/services/OnBoardingServices';
import Validations from '../validation/Validations';
import { createSuccessResponse, createErrorResponse, createValidateError } from '../responseHandler/responses';
import CustomErrors from '../responseHandler/CustomErrors';
import string from '../helpers/StringHelper';
import date from '../helpers/DateHelper';

// Init lib services to context:
const setupLibs = ctx => {
  const { appDb } = ctx;
  const { users, authentications } = appDb;
  return {
    users: new UserServices(users),
    authentications: new AuthenticationServices(authentications),
    onBoarding: OnBoardingServices,
  };
};

// Init mod services to context:
const setupMods = () => ({
  validations: Validations,
  responses: {
    createSuccessResponse,
    createErrorResponse,
    createValidateError,
    CustomErrors,
  },
  string,
  date,
});
export { setupLibs, setupMods };
export default setupLibs;
