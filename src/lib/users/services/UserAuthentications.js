import CommonSchemaFields from '#modules/validation/CommonSchemaFields';

// Built from the schema rather than written out again, so the two cannot drift.
const SESSION_TOKEN_PATTERN = new RegExp(CommonSchemaFields.sessionToken.pattern);

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

  async setupAuthentication(ctx) {
    const { header } = ctx.request;
    const headerKey = 'Bearer';
    let token;
    let user;
    if (header?.authorization) {
      const parts = header.authorization.split(' ');
      if (parts.length === 2 && parts[0] === headerKey) {
        token = parts.pop();
      }
    }
    if (token) {
      // A token that is not the current shape means no session — it does not
      // mean a bad request. Sessions minted before they moved to CSPRNG are
      // 24-character ObjectIds, and validating them threw, so every call
      // answered 400. The client only signs out on 401, so those users were
      // wedged in a loop until someone cleared their storage by hand.
      //
      // Falling through with no user lets the route layer answer
      // USER_NOT_AUTHENTICATED, which is both true and something the client
      // knows how to recover from. It grants nothing a throw would have
      // refused: the token still never reaches a query.
      if (!SESSION_TOKEN_PATTERN.test(token)) return;

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
      }
    }
  },
};

export default UserAuthentications;
