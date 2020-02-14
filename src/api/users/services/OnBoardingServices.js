import dateHelper from '../../../modules/helpers/DateHelper';
import stringHelper from '../../../modules/helpers/StringHelper';

export default class OnBoardingServices {
  static async makeUniqueClientNumber(ctx) {
    const tempCN = stringHelper.generateToken(6, false);
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
          bcrypt: await stringHelper.generateBcrypt(password),
        },
        email: {
          verificationTokens: [
            {
              createdAt: dateHelper.getNow(),
              token: stringHelper.generateToken(32),
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
      updatedAt: dateHelper.getNow(),
      createdAt: dateHelper.getNow(),
    };
  }
}
