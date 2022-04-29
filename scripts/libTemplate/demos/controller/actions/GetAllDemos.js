const GetAllDemos = {
  handler: async ctx => {
    const demos = await ctx.libS.demos.getAll();
    return ctx.modS.responses.createSuccessResponse(ctx, {
      demos,
    });
  },
};

export default GetAllDemos;
