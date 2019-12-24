import { ObjectId } from 'mongodb';
import Users from '../Users';
import StringHelper from '../../../modules/helpers/StringHelper';

export default class UserServices {
  static async add(newUser) {
    return Users().insertOne(newUser);
  }

  static async getById(_id, params = UserServices.publicParams) {
    if (!ObjectId.isValid(_id)) return null;
    return Users().findOne({ _id: ObjectId(_id) }, params);
  }

  static async getByEmail(email, params = UserServices.publicParams) {
    return Users().findOne({ 'email.address': email }, params);
  }

  static async getByEmailOrClientNumber(emailOrClientNumber, params = UserServices.publicParams) {
    return Users().findOne({
      $or: [
        { 'email.address': emailOrClientNumber },
        { clientNumber: emailOrClientNumber },
      ],
    }, params);
  }

  static getIdAsString(user) {
    return user._id.toString();
  }

  static async getByClientNumber(clientNumber, params = UserServices.publicParams) {
    return Users().findOne({ clientNumber }, params);
  }

  static async getAll(params = UserServices.publicParams) {
    return Users().find({}, params).toArray();
  }

  static getPasswordBcrypt(user) {
    if (user
      && user.services
      && user.services.password
      && user.services.password.bcrypt
    ) { return user.services.password.bcrypt; }
    return null;
  }

  static async checkPassword(user, password) {
    const bcryptHash = this.getPasswordBcrypt(user);
    if (bcryptHash) return StringHelper.compareBcrypt(password, bcryptHash);
    return false;
  }

  static publicParams = {
    projection: {
      _id: 1,
      email: 1,
      clientNumber: 1,
      profile: 1,
      settings: 1,
    },
  }
}
