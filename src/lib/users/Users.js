import UserEnums from './enums/UserEnums';
import setupCollection from './setupCollection';
import UserSchema from './schema/UserSchema';
import setupServices from './setupServices';

const Users = {
  collectionName: UserEnums.COLLECTION_NAME,
  setupCollection,
  schema: UserSchema,
  setupServices,
};

export default Users;
