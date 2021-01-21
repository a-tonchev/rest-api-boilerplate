import UserServices from './services/UserServices';
import UserEnums from './enums/UserEnums';

/**
 * @param  {object} ctx
 *
 * @return {{ users: UserServices }}
 *
 */

const setupServices = ctx => {
  const { db } = ctx;
  const collection = db[UserEnums.COLLECTION_NAME];

  // noinspection JSValidateTypes
  return {
    [UserEnums.COLLECTION_NAME]: new UserServices(collection),
  };
};

export default setupServices;
