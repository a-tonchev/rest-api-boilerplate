import UserEnums from './enums/UserEnums';
import setupCollection from './setupCollection';
import UserSchema from './schema/UserSchema';

const Users = {
  collectionName: UserEnums.COLLECTION_NAME,
  setupCollection,
  schema: UserSchema,
};

export default Users;
