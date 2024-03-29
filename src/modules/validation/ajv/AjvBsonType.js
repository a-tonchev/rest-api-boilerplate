const AjvBsonType = ajv => {
  const type = function (v) {
    if (v === null) {
      return 'null';
    }

    if (v === undefined) {
      return 'undefined';
    }

    const s = Object.prototype.toString.call(v);
    const t = s.match(/\[object (.*?)]/)[1].toLowerCase();

    if (t === 'number') {
      if (Number.isNaN(v)) {
        return 'nan';
      }

      if (!Number.isFinite(v)) {
        return 'infinity';
      }
    }

    return t;
  };

  const checkBsonType = (b, t, a) => (t === 'object') && (a._bsontype === b);

  const $type = function (a) {
    const t = type(a);

    return function (b) {
      switch (b) {
        case 1: case 'double':
          return (t === 'number') && ((`${a}`).indexOf('.') !== -1);
        case 2: case 'string':
          return t === 'string';
        case 3: case 'object':
          return t === 'object';
        case 4: case 'array':
          return t === 'array';
        case 6: case 'undefined':
          return ['null', 'undefined'].includes(t);
        case 7: case 'objectId':
          return checkBsonType('ObjectId', t, a);
        case 8: case 'bool': case 'boolean':
          return t === 'boolean';
        case 9: case 'date':
          return t === 'date';
        case 10: case 'null':
          return t === 'null';
        case 11: case 'regex':
          return t === 'regex';
        case 16: case 'int':
          return (t === 'number') && (a <= 2147483647) && ((`${a}`).indexOf('.') === -1);
        case 18: case 'long':
          // eslint-disable-next-line no-loss-of-precision
          return (t === 'number') && (a > 2147483647) && (a <= 9223372036854775807) && ((`${a}`).indexOf('.') === -1);
        case 19: case 'decimal':
          return checkBsonType('Decimal128', t, a);
        case 20: case 'number':
          return t === 'number';
        default: return false;
      }
    };
  };

  const validate = (schema, data) => {
    if (validate.errors === null) validate.errors = [];

    const v = $type(data);

    let msg; let
      passed;

    if (Array.isArray(schema)) {
      msg = schema.join(', ');
      passed = schema.some(v);
    } else {
      msg = schema;
      passed = v(schema);
    }

    if (!passed) {
      validate.errors.push({
        keyword: 'bsonType',
        params: {
          bsonType: schema,
        },
        message: `should be ${msg} got ${data}`,
      });
    }

    return passed;
  };

  ajv.addKeyword({
    keyword: 'bsonType',
    errors: true,
    validate,
  });
};

export default AjvBsonType;
