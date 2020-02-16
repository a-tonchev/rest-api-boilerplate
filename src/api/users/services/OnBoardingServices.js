export default class OnBoardingServices {
  static async makeUniqueClientNumber(ctx) {
    const tempCN = ctx.helpers.string.generateToken(6, false);
    const user = await ctx.services.users.getByClientNumber(tempCN);
    if (!user) return tempCN;
    return this.makeUniqueClientNumber(ctx);
  }

  static async prepareUser({
    email, password, language, profile, ctx,
  }) {
    return {
      email: {
        address: email,
        verified: false,
      },
      services: {
        password: {
          bcrypt: await ctx.helpers.string.generateBcrypt(password),
        },
        email: {
          verificationTokens: [
            {
              createdAt: ctx.helpers.date.getNow(),
              token: ctx.helpers.string.generateToken(32),
            },
          ],
        },
      },
      roles: [],
      clientNumber: await this.makeUniqueClientNumber(ctx),
      profile: profile || {},
      settings: {
        language: language || 'de',
      },
      updatedAt: ctx.helpers.date.getNow(),
      createdAt: ctx.helpers.date.getNow(),
    };
  }
}
