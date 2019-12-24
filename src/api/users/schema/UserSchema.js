import UserSchemaFields from './UserSchemaFields';
import CommonSchemaFields from '../../../modules/validation/CommonSchemaFields';

const {
  encryptedPassword,
  email,
  clientNumber,
  name,
  website,
  language,
} = UserSchemaFields;

const {
  _id,
  basicString,
  basicBoolean,
  date,
} = CommonSchemaFields;

const UserSchema = {
  bsonType: 'object',
  required: [
    'email',
    'services',
    'clientNumber',
    'settings',
    'profile',
    'updatedAt',
    'createdAt',
  ],
  additionalProperties: false,
  properties: {
    _id,
    email: {
      bsonType: 'object',
      required: ['address'],
      additionalProperties: false,
      properties: {
        address: email,
        verified: basicBoolean,
      },
    },
    services: {
      bsonType: 'object',
      required: ['password'],
      additionalProperties: false,
      properties: {
        password: {
          bsonType: 'object',
          required: ['bcrypt'],
          additionalProperties: false,
          properties: {
            bcrypt: encryptedPassword,
          },
        },
        email: {
          bsonType: 'object',
          additionalProperties: false,
          properties: {
            verificationTokens: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                properties: {
                  token: {
                    bsonType: 'string',
                    minLength: 1,
                  },
                  createdAt: date,
                },
              },
            },
          },
        },
      },
    },
    clientNumber: clientNumber,
    profile: {
      bsonType: 'object',
      additionalProperties: false,
      properties: {
        name: {
          bsonType: 'object',
          additionalProperties: false,
          properties: {
            first: name,
            last: name,
          },
        },
        website,
        address: {
          bsonType: 'object',
          additionalProperties: false,
          properties: {
            country: basicString,
            street: basicString,
            city: basicString,
            postalCode: basicString,
          },
        },
        companyName: basicString,
        industry: basicString,
        phone: basicString,
      },
    },
    roles: {
      bsonType: 'array',
      items: basicString,
    },
    settings: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['language'],
      properties: {
        language,
      },
    },
    updatedAt: date,
    createdAt: date,
  },
};

export default UserSchema;
