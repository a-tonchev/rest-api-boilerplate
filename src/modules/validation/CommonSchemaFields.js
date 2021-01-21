const CommonSchemaFields = {
  _id: {
    bsonType: 'objectId',
  },
  _idString: {
    bsonType: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  },
  basicObject: {
    bsonType: 'object',
  },
  date: {
    bsonType: 'date',
  },
  basicString: {
    bsonType: 'string',
  },
  requiredString: {
    bsonType: 'string',
    minLength: 1,
  },
  basicBoolean: {
    bsonType: 'bool',
  },
  price: {
    bsonType: 'number',
    minimum: 0,
  },
  simpleId12: {
    bsonType: 'string',
    pattern: '^[a-zA-Z0-9]{12}$',
  },
  simpleId14: {
    bsonType: 'string',
    pattern: '^[a-zA-Z0-9]{14}$',
  },
  emptyString: {
    bsonType: 'string',
    maxLength: 0,
  },
  basicNumber: {
    bsonType: 'number',
  },
  positiveNumber: {
    bsonType: 'number',
    minimum: 0,
  },
  currency: {
    bsonType: 'string',
    maxLength: 3,
    minLength: 3,
  },
  language: {
    bsonType: 'string',
    maxLength: 2,
    minLength: 2,
  },
  basicArray: {
    bsonType: 'array',
  },
  stringArray: {
    bsonType: 'array',
    items: {
      bsonType: 'string',
    },
  },
  idStringArray: {
    bsonType: 'array',
    items: {
      bsonType: 'string',
      pattern: '^[a-fA-F0-9]{24}$',
    },
  },
  _idArray: {
    bsonType: 'array',
    items: {
      bsonType: 'objectId',
    },
  },
  alphaNumeric: {
    bsonType: 'string',
    pattern: '^[a-zA-Z0-9_-]*$',
  },
  nullOrNumber: {
    bsonType: ['null', 'number'],
  },
};

export default CommonSchemaFields;
