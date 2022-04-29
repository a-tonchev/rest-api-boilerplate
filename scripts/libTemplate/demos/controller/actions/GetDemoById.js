import CommonSchemaFields from '#modules/validation/CommonSchemaFields';

const GetDemoById = {
  handler: async ctx => ctx.modS.responses.createSuccessResponse(ctx, {
    demo: ctx.state.demo,
  }),
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

    ctx.state.demo = await ctx.libS.demos.getById(_id);

    ctx.modS.responses.createValidateError(ctx.state.demo, ctx, ctx.modS.responses.CustomErrors.NOT_FOUND);

    return valid;
  },
};

export default GetDemoById;
