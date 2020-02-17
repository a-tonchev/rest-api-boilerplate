export default class OnBoardingServices {
  static async makeUniqueClientNumber(ctx) {
    const tempCN = ctx.modServices.string.generateToken(6, false);
    const user = await ctx.libServices.users.getByClientNumber(tempCN);
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
          bcrypt: await ctx.modServices.string.generateBcrypt(password),
        },
        email: {
          verificationTokens: [
            {
              createdAt: ctx.modServices.date.getNow(),
              token: ctx.modServices.string.generateToken(32),
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
      updatedAt: ctx.modServices.date.getNow(),
      createdAt: ctx.modServices.date.getNow(),
    };
  }
}
