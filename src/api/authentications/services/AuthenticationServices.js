import { ObjectId } from 'mongodb';
import Authentications from '../Authentications';
import UserServices from '../../users/services/UserServices';
import DateHelper from '../../../modules/helpers/DateHelper';

const activeSessionDays = 2;
const deleteSessionsAfter = 30;

export default class AuthenticationServices {
  static async add(newAuthentication) {
    await Authentications().insertOne(newAuthentication);
    return newAuthentication._id;
  }

  static async getById(_id) {
    if (!ObjectId.isValid(_id)) return null;
    return Authentications().findOne({ _id: ObjectId(_id) });
  }

  static async getAll() {
    return Authentications().find({}).toArray();
  }

  static async removeOld() {
    return Authentications().deleteMany({
      lastActivity: { $lt: DateHelper.getBefore({ days: deleteSessionsAfter }) },
    });
  }

  static prepareAuthenticationSession(userId, ctx) {
    const { userAgent, request } = ctx;
    const { ip } = request;
    const { _agent } = userAgent;
    return {
      userId,
      userAgent: {
        requestIp: ip,
        ..._agent,
      },
      lastActivity: DateHelper.getNow(),
      createdAt: DateHelper.getNow(),
    };
  }

  static async checkAuthenticated(token) {
    const existingAuthentication = await this.getById(token);
    if (
      existingAuthentication
      && DateHelper.getBefore({ days: activeSessionDays })
      < existingAuthentication.lastActivity
    ) { return existingAuthentication; }
    return false;
  }

  static async updateLastActivity(_id) {
    return Authentications().updateOne({ _id }, {
      $set: {
        lastActivity: DateHelper.getNow(),
      },
    });
  }

  static async getUserByToken(token) {
    const session = await this.checkAuthenticated(token);
    if (session) {
      await this.updateLastActivity(session._id);
      return UserServices.getById(session.userId, {});
    }
    return null;
  }
}
