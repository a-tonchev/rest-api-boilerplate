import AuthenticationEnums from './enums/AuthenticationEnums';
import setupCollection from './setupCollection';
import AuthenticationSchema from './schema/AuthenticationSchema';
import setupServices from './setupServices';

const Authentications = {
  collectionName: AuthenticationEnums.COLLECTION_NAME,
  setupCollection,
  schema: AuthenticationSchema,
  setupServices,
};
export default Authentications;
