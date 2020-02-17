import getCollection from './getCollection';
import UserEnums from '../../lib/users/enums/UserEnums';
import AuthenticationEnums from '../../lib/authentications/enums/AuthenticationEnums';

const setupDatabase = db => ({
  users: getCollection(UserEnums.COLLECTION_NAME, db),
  authentications: getCollection(AuthenticationEnums.COLLECTION_NAME, db),
});

export default setupDatabase;
