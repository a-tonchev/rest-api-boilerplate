const UserSchemaFields = {
  userId: {
    bsonType: 'string',
    pattern: '^[0-9a-fA-F]{24}$',
  },
  password: {
    bsonType: 'string',
    type: 'string',
    pattern: '^.{8,}$',
    description: 'password',
    title: 'password',
    message: 'password',
  },
  website: {
    bsonType: 'string',
  },
  emailAddress: {
    bsonType: 'string',
    pattern: '^\\S+@\\S+$',
  },
  clientNumber: {
    bsonType: 'string',
    pattern: '^[a-zA-Z0-9]{6}$',
  },
  encryptedPassword: {
    bsonType: 'string',
    pattern: '^\\$2[ayb]\\$.{56}$',
  },
  name: {
    bsonType: 'string',
    pattern: '^[a-zA-Z]{2,}$',
  },
  date: {
    bsonType: 'date',
  },
  language: {
    bsonType: 'string',
    pattern: '^[a-z]{2}$',
  },
};

export default UserSchemaFields;
