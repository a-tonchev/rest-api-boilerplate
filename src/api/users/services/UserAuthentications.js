export default class UserAuthentications {
  static async isUserAuthenticated(ctx) {
    const { user } = ctx.state;
    return !!user;
  }

  static async setupAuthentication(ctx, next) {
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
      user = await ctx.services.authentications.getUserByToken(ctx, token);
      if (user) {
        ctx.state.user = user;
      }
    }
    try {
      await next();
    } finally {
      ctx.state.user = null;
    }
  }
}
