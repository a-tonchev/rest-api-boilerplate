import { UserRoles, UserStatuses } from '../enums/UserEnums';

const OnBoardingServices = {
  async makeUniqueClientNumber(ctx) {
    const tempCN = ctx.modS.string.generateToken(6, false);
    const user = await ctx.libS.users.getByClientNumber(tempCN);
    if (!user) return tempCN;
    return this.makeUniqueClientNumber(ctx);
  },

  async prepareUser({
    email, password, language, profile, ctx,
  }) {
    return {
      email: {
        address: email,
        verified: false,
      },
      services: {
        password: {
          bcrypt: await ctx.modS.string.generateBcrypt(password),
        },
        email: {
          verificationTokens: [
            {
              createdAt: ctx.modS.date.getNow(),
              token: ctx.modS.string.generateToken(32),
            },
          ],
        },
      },
      status: UserStatuses.ACTIVE,
      roles: [UserRoles.USER],
      clientNumber: await this.makeUniqueClientNumber(ctx),
      profile: profile || {},
      settings: {
        language: language || 'de',
      },
      updatedAt: ctx.modS.date.getNow(),
      createdAt: ctx.modS.date.getNow(),
    };
  },
};

export default OnBoardingServices;
