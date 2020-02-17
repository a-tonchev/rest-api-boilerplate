import { ObjectId } from 'mongodb';
import DateHelper from '../../../modules/helpers/DateHelper';

const activeSessionDays = 2;
const deleteSessionsAfter = 30;

class AuthenticationServices {
  authDb = null;

  constructor(authDb) {
    this.authDb = authDb;
  }

  async add(newAuthentication) {
    await this.authDb.insertOne(newAuthentication);
    return newAuthentication._id;
  }

  async getById(_id) {
    if (!ObjectId.isValid(_id)) return null;
    return this.authDb.findOne({ _id: ObjectId(_id) });
  }

  async getAll() {
    return this.authDb.find({}).toArray();
  }

  async removeOld() {
    return this.authDb.deleteMany({
      lastActivity: { $lt: DateHelper.getBefore({ days: deleteSessionsAfter }) },
    });
  }

  prepareAuthenticationSession(userId, ctx) {
    const { userAgent, request, helpers } = ctx;
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

  async checkAuthenticated(token) {
    const existingAuthentication = await this.getById(token);
    if (
      existingAuthentication
      && DateHelper.getBefore({ days: activeSessionDays })
      < existingAuthentication.lastActivity
    ) { return existingAuthentication; }
    return false;
  }

  async updateLastActivity(_id) {
    return this.authDb.updateOne({ _id }, {
      $set: {
        lastActivity: DateHelper.getNow(),
      },
    });
  }

  async getUserByToken(ctx, token) {
    const session = await this.checkAuthenticated(token);
    if (session) {
      await this.updateLastActivity(session._id);
      return ctx.libServices.users.getById(session.userId, {});
    }
    return null;
  }
}

export default AuthenticationServices;
