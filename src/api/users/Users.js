import UserEnums from './enums/UserEnums';
import { getAppDb } from '../../modules/db/mongoPool';

const Users = () => getAppDb(UserEnums.COLLECTION_NAME);

export default Users;
