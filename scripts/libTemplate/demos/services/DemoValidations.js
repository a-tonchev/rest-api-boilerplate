import CommonSchemaFields from '#modules/validation/CommonSchemaFields';

import DemoSchema from '../schema/DemoSchema';

const DemoValidations = {
  async validateUpdate(ctx) {
    const { demo } = ctx.request.body;
    const {
      createdAt, updatedAt, _id, ...restOfDemo
    } = demo;

    ctx.state.demo = restOfDemo;
    ctx.state._id = _id;

    const existingDemo = await ctx.libS.demos.getById(_id, { projection: { _id: 1 } });

    ctx.modS.responses.createValidateError(existingDemo, ctx, ctx.modS.responses.CustomErrors.NOT_FOUND);

    return ctx.modS.validations.validateSchema(ctx, ctx.state.demo, DemoSchema);
  },

  async validateRemove(ctx) {
    const { _id } = ctx.request.body;

    const valid = ctx.modS.validations.validateSchema(ctx, { _id }, {
      bsonType: 'object',
      required: ['_id'],
      additionalProperties: false,
      properties: {
        _id: CommonSchemaFields._idString,
      },
    });

    ctx.state._id = _id;
    const existingDemo = await ctx.libS.demos.getById(_id, { projection: { _id: 1 } });

    ctx.modS.responses.createValidateError(existingDemo, ctx, ctx.modS.responses.CustomErrors.NOT_FOUND);

    return valid;
  },

  async validateGetById(ctx) {
    const { _id } = ctx.request.body;

    const valid = ctx.modS.validations.validateSchema(ctx, { _id }, {
      bsonType: 'object',
      required: ['_id'],
      additionalProperties: false,
      properties: {
        _id: CommonSchemaFields._idString,
      },
    });

    ctx.state.demo = await ctx.libS.demos.getById(_id);

    ctx.modS.responses.createValidateError(ctx.state.demo, ctx, ctx.modS.responses.CustomErrors.NOT_FOUND);

    return valid;
  },

  async validateCreate(ctx) {
    const { demo: rawData } = ctx.request.body;

    const { _id, ...demo } = rawData;
    ctx.state.demo = demo;

    return ctx.modS.validations.validateSchema(ctx, demo, DemoSchema);
  },
};

export default DemoValidations;
