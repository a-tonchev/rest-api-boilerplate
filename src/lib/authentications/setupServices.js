import AuthenticationEnums from './enums/AuthenticationEnums';
import AuthenticationServices from './services/AuthenticationServices';

const setupServices = ctx => {
  const { db } = ctx;
  const authentications = db[AuthenticationEnums.COLLECTION_NAME];

  return {
    authentications: new AuthenticationServices(authentications),
  };
};

export default setupServices;
