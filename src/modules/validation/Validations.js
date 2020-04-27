import Ajv from 'ajv';
import AjvBson from 'ajv-bsontype';
import AjvErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
AjvBson(ajv);
AjvErrors(ajv);

export default class Validations {
  static prepareProperties({ properties, ...schemaFields }) {
    const preparedFields = { ...schemaFields };
    const preparedProperties = {};
    Object.keys(properties).forEach(item => {
      const preparedObject = properties[item].properties
        ? Validations.prepareProperties(properties[item])
        : properties[item];

      preparedProperties[item] = {
        ...preparedObject,
        errorMessage: item,
      };
    });
    preparedFields.properties = preparedProperties;
    return preparedFields;
  }

  static validateSchema(ctx, data, schema) {
    const preparedSchema = this.prepareProperties(schema);
    const validate = ajv.compile(preparedSchema);
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

      return ctx.modS.responses.createErrorResponse(
        ctx, ctx.modS.responses.CustomErrors.BAD_REQUEST,
        { errors },
      );
    }
    return valid;
  }
}
