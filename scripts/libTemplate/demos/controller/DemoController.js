const DemoController = {
  async getAll(ctx) {
    const demos = await ctx.libS.demos.getAll();
    return ctx.modS.responses.createSuccessResponse(ctx, {
      demos,
    });
  },

  async getById(ctx) {
    return ctx.modS.responses.createSuccessResponse(ctx, {
      demo: ctx.state.demo,
    });
  },

  async create(ctx) {
    const { demo } = ctx.state;
    await ctx.libS.demos.add(demo);
    return ctx.modS.responses.createSuccessResponse(ctx);
  },

  async update(ctx) {
    const { _id, demo } = ctx.state;
    await ctx.libS.demos.update({ _id, ...demo });
    return ctx.modS.responses.createSuccessResponse(ctx);
  },

  async remove(ctx) {
    const { _id } = ctx.state;
    await ctx.libS.demos.removeById(_id);
    return ctx.modS.responses.createSuccessResponse(ctx);
  },
};

export default DemoController;
