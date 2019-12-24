import { getDb } from '../../modules/db/mongoPool';
import AuthenticationEnums from './enums/AuthenticationEnums';

const Authentications = () => {
  const db = getDb();
  if (db) return db.collection(AuthenticationEnums.COLLECTION_NAME);
};

export default Authentications;
