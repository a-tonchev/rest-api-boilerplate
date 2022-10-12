import DemoSchema from '../../schema/DemoSchema';

const UpdateDemo = {
  handler: async ctx => {
    const { _id, demo } = ctx.state;
    await ctx.libS.demos.update({ _id, ...demo });
    return ctx.modS.responses.createSuccessResponse(ctx);
  },
  validation: async ctx => {
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
};

export default UpdateDemo;
