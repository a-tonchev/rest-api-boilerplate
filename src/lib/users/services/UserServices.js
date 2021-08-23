import DotN from 'mongo-dot-notation';

import DateHelper from '#modules/helpers/DateHelper';
import ServicesBase from '#lib/base/services/ServicesBase';
import UserHelpers from '#lib/users/services/UserHelpers';

import OnBoardingServices from './OnBoardingServices';
import { UserStatuses } from '../enums/UserEnums';

class UserServices extends ServicesBase {
  helpers = {
    ...super.getHelpers(),
    ...UserHelpers,
    onBoarding: OnBoardingServices,
  }

  async add(newUser) {
    return this.DB.insertOne(newUser);
  }

  async getActiveById(id, params = this.publicParams) {
    const _id = this.helpers.getObjectId(id);
    if (!_id) return null;
    return this.DB.findOne({ _id, status: UserStatuses.ACTIVE }, params);
  }

  async verifyUser({ clientNumber }) {
    return this.DB.updateOne({
      clientNumber,
    }, {
      $set: {
        'services.email.verificationTokens': [],
        'email.verified': true,
      },
    });
  }

  async resetPassword(_id, password) {
    return this.DB.updateOne({
      _id,
    }, {
      $set: {
        'services.password.bcrypt': password,
      },
      $unset: {
        'services.password.resetPasswordToken': 1,
        'services.password.lastResetRequest': 1,
      },
    });
  }

  async updatePassword(clientNumber, password) {
    return this.DB.updateOne({
      clientNumber,
    }, {
      $set: {
        'services.password.bcrypt': password,
      },
    });
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

  async updateLastVerificationSent(_id) {
    return this.DB.updateOne({ _id }, {
      $set: {
        'services.email.lastVerificationSent': DateHelper.getNow(),
      },
    });
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
