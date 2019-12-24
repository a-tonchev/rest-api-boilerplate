import AuthenticationSchemaFields from './AuthenticationSchemaFields';
import UserSchemaFields from '../../users/schema/UserSchemaFields';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

const {
  userAgent,
} = AuthenticationSchemaFields;

const {
  _id,
  date,
} = CommonSchemaFields;

const {
  userId,
} = UserSchemaFields;

const AuthenticationSchema = {
  bsonType: 'object',
  required: [
    'userId',
    'lastActivity',
    'createdAt',
  ],
  additionalProperties: false,
  properties: {
    _id,
    userId,
    userAgent,
    lastActivity: date,
    createdAt: date,
  },
};

export default AuthenticationSchema;
