import CommonSchemaFields from '#modules/validation/CommonSchemaFields';

import UserSchemaFields from './UserSchemaFields';

const {
  encryptedPassword,
  email,
  clientNumber,
  name,
  website,
  language,
  phone,
  roles,
  status,
} = UserSchemaFields;

const {
  _id,
  basicString,
  basicBoolean,
  date,
  requiredString,
  positiveNumber,
  emptyString,
} = CommonSchemaFields;

const AddressBaseSchema = {
  bsonType: 'object',
  required: [
    'firstName',
    'lastName',
    'addressLine1',
    'country',
    'city',
    'zip',
  ],
  additionalProperties: false,
  properties: {
    _id: basicString,
    firstName: name,
    lastName: name,
    companyName: basicString,
    addressLine1: basicString,
    addressLine2: basicString,
    country: basicString,
    stateProvince: basicString,
    city: basicString,
    zip: basicString,
    phone: {
      anyOf: [
        emptyString,
        phone,
      ],
    },
    email: email,
  },
};

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
    'status',
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
      required: ['password', 'email'],
      additionalProperties: false,
      properties: {
        password: {
          bsonType: 'object',
          required: ['bcrypt'],
          additionalProperties: false,
          properties: {
            bcrypt: encryptedPassword,
            resetPasswordToken: requiredString,
            lastResetRequest: date,
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
                  token: requiredString,
                  createdAt: date,
                },
              },
            },
            lastVerificationSent: date,
          },
        },
        payment: {
          bsonType: 'object',
          additionalProperties: false,
          properties: {
            stripeId: requiredString,
          },
        },
        security: {
          bsonType: 'object',
          additionalProperties: false,
          properties: {
            loginAttempts: positiveNumber,
            lastLoginAttempt: date,
          },
        },
      },
    },
    clientNumber: clientNumber,
    status,
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
        phone,
        address: AddressBaseSchema,
        companyName: basicString,
        industry: basicString,
      },
    },
    roles,
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

export { AddressBaseSchema };
export default UserSchema;
