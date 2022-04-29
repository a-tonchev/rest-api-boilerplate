import DemoSchema from '../../schema/DemoSchema';

const CreateDemo = {
  handler: async ctx => {
    const { demo } = ctx.state;
    await ctx.libS.demos.add(demo);
    return ctx.modS.responses.createSuccessResponse(ctx);
  },
  validation: async ctx => {
    const { demo: rawData } = ctx.request.body;

    const { _id, ...demo } = rawData;
    ctx.state.demo = demo;

    return ctx.modS.validations.validateSchema(ctx, demo, DemoSchema);
  },
};

export default CreateDemo;
