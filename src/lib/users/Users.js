import UserRoutes from './controller/UserRoutes';
import UserEnums from './enums/UserEnums';
import setupCollection from './setupCollection';
import UserSchema from './schema/UserSchema';
import setupServices from './setupServices';

const Users = {
  collectionName: UserEnums.COLLECTION_NAME,
  setupCollection,
  schema: UserSchema,
  setupServices,
  routes: UserRoutes,
};

export default Users;
