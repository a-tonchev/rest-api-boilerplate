const AuthenticationSchemaFields = {
  tokenHash: {
    bsonType: 'string',
    pattern: '^[a-f0-9]{64}$',
  },
  userAgent: {
    bsonType: 'object',
  },
};

export default AuthenticationSchemaFields;
