import AuthenticationEnums from './enums/AuthenticationEnums';
import AuthenticationServices from './services/AuthenticationServices';

/**
 * @param  {object} ctx
 *
 * @return {{ authentications: AuthenticationServices }}
 *
 */

const setupServices = ctx => {
  const { db } = ctx;
  const collection = db[AuthenticationEnums.COLLECTION_NAME];

  // noinspection JSValidateTypes
  return {
    [AuthenticationEnums.COLLECTION_NAME]: new AuthenticationServices(collection),
  };
};

export default setupServices;
