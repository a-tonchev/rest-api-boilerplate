import mongodb from 'mongodb';
import get from 'lodash-es/get';
import DotN from 'mongo-dot-notation';
import StringHelper from '../../../modules/helpers/StringHelper';
import OnBoardingServices from './OnBoardingServices';
import DateHelper from '../../../modules/helpers/DateHelper';
import { UserStatuses } from '../enums/UserEnums';

const { ObjectId } = mongodb;

class UserServices {
  DB = null;

  onBoarding = OnBoardingServices;

  constructor(userDb) {
    this.DB = userDb;
  }

  async add(newUser) {
    return this.DB.insertOne(newUser);
  }

  async getById(_id, params = this.publicParams) {
    if (!ObjectId.isValid(_id)) return null;
    return this.DB.findOne({ _id: ObjectId(_id) }, params);
  }

  async getActiveById(_id, params = this.publicParams) {
    if (!ObjectId.isValid(_id)) return null;
    return this.DB.findOne({ _id: ObjectId(_id), status: UserStatuses.ACTIVE }, params);
  }

  async getByEmail(email, params = this.publicParams) {
    return this.DB.findOne({ 'email.address': email }, params);
  }

  async getByResetToken(resetToken, params = this.publicParams) {
    return this.DB.findOne({ 'services.password.resetPasswordToken': resetToken }, params);
  }

  async getByEmailOrClientNumber(emailOrClientNumber, params = this.publicParams) {
    return this.DB.findOne({
      $or: [
        { 'email.address': emailOrClientNumber },
        { clientNumber: emailOrClientNumber },
      ],
    }, params);
  }

  getIdAsString(user) {
    return user._id.toString();
  }

  async getByClientNumber(clientNumber, params = this.publicParams) {
    return this.DB.findOne({ clientNumber }, params);
  }

  async getAll(params = this.publicParams) {
    return this.DB.find({}, params).toArray();
  }

  getPasswordBcrypt(user) {
    if (user
      && user.services
      && user.services.password
      && user.services.password.bcrypt
    ) { return user.services.password.bcrypt; }
    return null;
  }

  async getUserToVerify(verificationToken) {
    return this.DB.findOne({
      'services.email.verificationTokens': {
        $elemMatch: { token: verificationToken },
      },
    });
  }

  async addResetToken(clientNumber, resetToken) {
    return this.DB.updateOne({
      clientNumber,
    }, {
      $set: {
        'services.password.resetPasswordToken': resetToken,
        'services.password.lastResetRequest': DateHelper.getNow(),
      },
    });
  }

  async updateByClientNumber(clientNumber, data) {
    const flattenSetProfile = DotN.flatten({
      ...data,
      updatedAt: DateHelper.getNow(),
    });
    return this.DB.updateOne({
      clientNumber,
    }, flattenSetProfile);
  }

  async updateProfile(_id, profile) {
    const flattenSetProfile = DotN.flatten({
      profile: profile,
      updatedAt: DateHelper.getNow(),
    });
    await this.DB.updateOne({
      _id,
    }, flattenSetProfile);
    return true;
  }

  async resetLoginAttempts(user) {
    return this.DB.updateOne({
      _id: user._id,
    }, {
      $set: {
        'services.security.loginAttempts': 0,
      },
    });
  }

  async updateLoginAttempts(user) {
    return this.DB.updateOne({
      _id: user._id,
    }, {
      $set: {
        'services.security.lastLoginAttempt': DateHelper.getNow(),
      },
      $inc: {
        'services.security.loginAttempts': 1,
      },
    });
  }

  getEmail(user) {
    return get(user, 'email.address', '');
  }

  isVerified(user) {
    return user && user.email && user.email.verified;
  }

  getVerificationToken(user) {
    if (user && user.services.email.verificationTokens[0]) {
      return user.services.email.verificationTokens[0].token;
    }
    return null;
  }

  async updateLastVerificationSent(_id) {
    return this.DB.updateOne({ _id }, {
      $set: {
        'services.email.lastVerificationSent': DateHelper.getNow(),
      },
    });
  }

  async checkPassword(user, password) {
    const bcryptHash = this.getPasswordBcrypt(user);
    if (bcryptHash) return StringHelper.compareBcrypt(password, bcryptHash);
    return false;
  }

  publicParams = {
    projection: {
      _id: 1,
      email: 1,
      clientNumber: 1,
      profile: 1,
      settings: 1,
      roles: 1,
    },
  }
}

export default UserServices;
