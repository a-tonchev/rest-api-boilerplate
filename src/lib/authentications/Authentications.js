import AuthenticationEnums from './enums/AuthenticationEnums';
import setupCollection from './setupCollection';
import AuthenticationSchema from './schema/AuthenticationSchema';

const Authentications = {
  collectionName: AuthenticationEnums.COLLECTION_NAME,
  setupCollection,
  schema: AuthenticationSchema,
};
export default Authentications;
