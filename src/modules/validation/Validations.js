import Ajv from 'ajv-draft-04';
import cloneDeep from 'lodash-es/cloneDeep';

import AjvBsonType from '#modules/validation/ajv/AjvBsonType';

const ajv = new Ajv({
  allErrors: true, strictTypes: false, verbose: true,
});
AjvBsonType(ajv);

// Compile each schema once and cache the validator by the schema's object
// identity instead of cloning + JSON.stringify-ing the whole schema on every
// request. A WeakMap keyed by the schema object gives eviction for free (the
// validator dies with the schema), so there is no unbounded registry growth
// even if a caller builds schemas dynamically. Per schema we keep a small Map of
// exclude-variants keyed by the sorted list of excluded attributes.
const validatorCache = new WeakMap();

const getValidator = (schemaToUse, attributesToExclude) => {
  let byExclude = validatorCache.get(schemaToUse);
  if (!byExclude) {
    byExclude = new Map();
    validatorCache.set(schemaToUse, byExclude);
  }

  const excludeKey = attributesToExclude && attributesToExclude.length
    ? [...attributesToExclude].sort().join(',')
    : '';

  let validate = byExclude.get(excludeKey);
  if (!validate) {
    // Clone only when we actually mutate the schema to strip attributes; the
    // common (no-exclude) path compiles the original object directly.
    const schema = excludeKey
      ? Validations.getSchemaWithoutAttributes(cloneDeep(schemaToUse), attributesToExclude)
      : schemaToUse;
    validate = ajv.compile(schema);
    byExclude.set(excludeKey, validate);
  }

  return validate;
};

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

    const validate = getValidator(schemaToUse, attributesToExclude);

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
