import AuthenticationEnums from './enums/AuthenticationEnums';
import { getAppDb } from '../../modules/db/mongoPool';

const Authentications = () => getAppDb(AuthenticationEnums.COLLECTION_NAME);

export default Authentications;
