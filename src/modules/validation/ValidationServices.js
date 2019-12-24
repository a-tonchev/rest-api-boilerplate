import Ajv from 'ajv';
import AjvBson from 'ajv-bsontype';
import AjvErrors from 'ajv-errors';

import { createErrorResponse } from '../responseHandler/responses';
import CustomErrors from '../responseHandler/CustomErrors';

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
AjvBson(ajv);
AjvErrors(ajv);

export default class ValidationServices {
  static prepareForParamsValidation(schemaFields) {
    const paramsFields = {};
    Object.keys(schemaFields).forEach(function (item) {
      const { ...rest } = schemaFields[item];
      paramsFields[item] = { ...rest, errorMessage: item };
    });
    return paramsFields;
  }

  static validateSchema(ctx, data, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!ctx) return valid;
    if (!valid) {
      const errors = validate.errors && validate.errors.length ? validate.errors.map(e => {
        const { params, message } = e;
        const { missingProperty } = params;
        if (missingProperty) {
          return missingProperty;
        }
        return message;
      }) : [];

      return createErrorResponse(ctx, CustomErrors.BAD_REQUEST, { errors });
    }
    return valid;
  }
}
