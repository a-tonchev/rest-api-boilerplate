import { ObjectId } from 'mongodb';
import StringHelper from '../../../modules/helpers/StringHelper';

class UserServices {
  usersDb = null;

  constructor(userDb) {
    this.usersDb = userDb;
  }

  async add(newUser) {
    return this.usersDb.insertOne(newUser);
  }

  async getById(_id, params = this.publicParams) {
    if (!ObjectId.isValid(_id)) return null;
    return this.usersDb.findOne({ _id: ObjectId(_id) }, params);
  }

  async getByEmail(email, params = this.publicParams) {
    return this.usersDb.findOne({ 'email.address': email }, params);
  }

  async getByEmailOrClientNumber(emailOrClientNumber, params = this.publicParams) {
    return this.usersDb.findOne({
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
    return this.usersDb.findOne({ clientNumber }, params);
  }

  async getAll(params = this.publicParams) {
    return this.usersDb.find({}, params).toArray();
  }

  getPasswordBcrypt(user) {
    if (user
      && user.services
      && user.services.password
      && user.services.password.bcrypt
    ) { return user.services.password.bcrypt; }
    return null;
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
    },
  }
}

export default UserServices;
