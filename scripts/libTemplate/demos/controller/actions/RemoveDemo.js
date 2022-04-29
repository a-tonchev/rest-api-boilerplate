import CommonSchemaFields from '#modules/validation/CommonSchemaFields';

const RemoveDemo = {
  handler: async ctx => {
    const { _id } = ctx.state;
    await ctx.libS.demos.removeById(_id);
    return ctx.modS.responses.createSuccessResponse(ctx);
  },
  validation: async ctx => {
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
};

export default RemoveDemo;
