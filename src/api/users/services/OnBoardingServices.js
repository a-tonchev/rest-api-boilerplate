import dateHelper from '../../../modules/helpers/DateHelper';
import stringHelper from '../../../modules/helpers/StringHelper';
import UserServices from './UserServices';

export default class OnBoardingServices {
  static async makeUniqueClientNumber() {
    const tempCN = stringHelper.generateToken(6, false);
    const user = await UserServices.getByClientNumber(tempCN);
    if (!user) return tempCN;
    return this.makeUniqueClientNumber();
  }

  static async prepareUser({
    email, password, language, profile,
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
      clientNumber: await this.makeUniqueClientNumber(),
      profile: profile || {},
      settings: {
        language: language || 'de',
      },
      updatedAt: dateHelper.getNow(),
      createdAt: dateHelper.getNow(),
    };
  }
}
