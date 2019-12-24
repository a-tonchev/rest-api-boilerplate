import { Validator } from 'jsonschema';
import { createErrorResponse } from '../responseHandler/responses';
import CustomErrors from '../responseHandler/CustomErrors';

export default class ValidationServices {
  static prepareForParamsValidation(schemaFields) {
    const paramsFields = {};
    Object.keys(schemaFields).forEach(function (item) {
      const { bsonType, ...rest } = schemaFields[item];
      paramsFields[item] = { type: bsonType, ...rest };
    });
    return paramsFields;
  }

  static validateSchema(ctx, data, schema) {
    const v = new Validator();
    const validation = v.validate(data, schema);
    if (!ctx) return validation;
    if (!validation.valid) {
      const errors = validation.errors.map(e => {
        let { argument } = e;
        if (e.property.includes('.')) {
          argument = e.property.split('.').slice(1).join('.');
        }
        return argument;
      });
      return createErrorResponse(ctx, CustomErrors.BAD_REQUEST, { errors });
    }
    return validation;
  }
}
