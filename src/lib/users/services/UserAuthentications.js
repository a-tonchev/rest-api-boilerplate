const UserAuthentications = {
  async isUserAuthenticated(ctx) {
    const { user } = ctx.privateState;
    return !!user;
  },

  async logoutUser(ctx, token) {
    try {
      if (token) {
        await ctx.libS.authentications.deactivateAuthentication(token);
      }
    } catch (err) {
      return ctx.modS.responses.createErrorResponse(
        ctx,
        ctx.modS.responses.CustomErrors.BAD_REQUEST,
        {},
        err,
      );
    }
  },

  async setupAuthentication(ctx, next) {
    const { header } = ctx.request;
    const headerKey = 'Bearer';
    let token;
    let user;
    if (header && header.authorization) {
      const parts = header.authorization.split(' ');
      if (parts.length === 2 && parts[0] === headerKey) {
        token = parts.pop();
      }
    }
    if (token) {
      user = await ctx.libS.authentications.getActiveUserByToken(ctx, token);
      if (user) {
        ctx.privateState.user = user;
        ctx.privateState.logoutUser = () => UserAuthentications.logoutUser(ctx, token);

        const { body = {} } = ctx.request;
        const { userHash = '' } = body;
        const newUserHash = ctx.modS.string.createHash(user.updatedAt);

        if (userHash && userHash !== newUserHash) {
          ctx.state.newUserData = {
            roles: user.roles,
            language: user.settings.language,
            profile: user.profile,
            updatedAt: user.updatedAt,
            userHash: newUserHash,
          };
        }
      } else {
        await UserAuthentications.logoutUser(ctx, token);
      }
    }
    try {
      await next();
    } finally {
      ctx.privateState.user = null;
    }
  },
};

export default UserAuthentications;
