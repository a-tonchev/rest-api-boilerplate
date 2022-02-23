import Ajv from 'ajv-draft-04';
import cloneDeep from 'lodash-es/cloneDeep';

import AjvBsonType from '#modules/validation/ajv/AjvBsonType';

const ajv = new Ajv({
  allErrors: true, strictTypes: false, verbose: true,
});
AjvBsonType(ajv);

const Validations = {
  validateSchema(ctx, data, schemaToUse, attributesToExclude, returnErrors = false) {
    if (!schemaToUse) {
      console.error('Invalid Schema!');
      return false;
    }

    if (!data) {
      console.error('The provided data should be object!');
      return false;
    }

    const fullSchema = cloneDeep(schemaToUse);
    const schema = attributesToExclude
      ? Validations.getSchemaWithoutAttributes(
        fullSchema,
        attributesToExclude,
      )
      : fullSchema;

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!ctx) return valid;

    if (!valid) {
      const detailedErrors = [];

      const errorsSet = new Set();

      validate.errors?.forEach(validateError => {
        const { instancePath, message, params } = validateError;

        let errorPath = '';
        let error = '';

        if (!instancePath && params.missingProperty) error = params.missingProperty;

        const [, ...instancePathRest] = instancePath.split('/');

        instancePathRest.forEach((ip, index) => {
          if (!Number.isNaN(Number(ip))) {
            if (errorPath[errorPath.length - 1] === '.') { errorPath = errorPath.substring(0, errorPath.length - 1); }
            errorPath += `[${ip}]`;
          } else {
            errorPath += ip;
            if (!error) error = ip;
          }

          if (index < instancePathRest.length - 1) {
            errorPath += '.';
          }
        });

        const detailedError = {
          params: {
            ...(params.bsonType ? {
              type: params.bsonType,
            } : params),
          },
          message,
          errorPath,
        };

        detailedErrors.push(detailedError);

        if (error) errorsSet.add(error);
      });

      const errors = Array.from(errorsSet);

      if (!returnErrors) {
        return ctx.modS.responses.createErrorResponse(
          ctx,
          ctx.modS.responses.CustomErrors.BAD_REQUEST,
          { errors, detailedErrors },
          JSON.stringify(validate.errors),
        );
      }
      return errors;
    }
    return valid;
  },

  getSchemaWithoutAttributes(schema, attributesToRemove) {
    const { properties, required, ...data } = schema;
    attributesToRemove.forEach(attribute => {
      delete properties[attribute];
    });
    return {
      ...data,
      required: required.filter(rq => !attributesToRemove.includes(rq)),
      properties,
    };
  },
};

export default Validations;
