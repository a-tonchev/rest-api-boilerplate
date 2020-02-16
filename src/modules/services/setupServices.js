import UserServices from '../../api/users/services/UserServices';
import AuthenticationServices from '../../api/authentications/services/AuthenticationServices';
import OnBoardingServices from '../../api/users/services/OnBoardingServices';
import Validations from '../validation/Validations';
import { createSuccessResponse, createErrorResponse, createValidateError } from '../responseHandler/responses';
import CustomErrors from '../responseHandler/CustomErrors';
import string from '../helpers/StringHelper';
import date from '../helpers/DateHelper';

// Init all app services:
const setupServices = ctx => {
  const { appDb } = ctx;
  const { users, authentications } = appDb;
  // Setup services
  const services = {
    users: new UserServices(users),
    authentications: new AuthenticationServices(authentications),
    onBoarding: OnBoardingServices,
  };
  // Setup helpers
  const helpers = {
    validations: Validations,
    responses: {
      createSuccessResponse,
      createErrorResponse,
      createValidateError,
      CustomErrors,
    },
    string,
    date,
  };
  return {
    services, helpers,
  };
};

export default setupServices;
