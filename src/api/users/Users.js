import { getDb } from '../../modules/db/mongoPool';
import UserEnums from './enums/UserEnums';

const Users = () => {
  const db = getDb();
  if (db) return db.collection(UserEnums.COLLECTION_NAME);
};

export default Users;
