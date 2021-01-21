import { UserRoles, UserStatuses } from '../enums/UserEnums';

const UserSchemaFields = {
  userId: {
    bsonType: 'string',
    pattern: '^[0-9a-fA-F]{24}$',
  },
  password: {
    bsonType: 'string',
    type: 'string',
    pattern: '^.{8,}$',
  },
  website: {
    bsonType: 'string',
  },
  email: {
    bsonType: 'string',
    pattern: '^\\S+@\\S+$',
  },
  clientNumber: {
    bsonType: 'string',
    pattern: '^[a-zA-Z0-9]{6}$',
  },
  phone: {
    bsonType: 'string',
    pattern: '^(\\+)(\\d+)$',
  },
  encryptedPassword: {
    bsonType: 'string',
    pattern: '^\\$2[ayb]\\$.{56}$',
  },
  name: {
    bsonType: 'string',
    minLength: 2,
  },
  date: {
    bsonType: 'date',
  },
  language: {
    bsonType: 'string',
    pattern: '^[a-z]{2}$',
  },
  roles: {
    bsonType: 'array',
    items: {
      enum: Object.values(UserRoles),
    },
  },
  status: {
    bsonType: 'string',
    enum: Object.values(UserStatuses),
  },
};

export default UserSchemaFields;
