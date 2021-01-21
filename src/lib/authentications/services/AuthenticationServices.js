import mongodb from 'mongodb';
import DateHelper from '../../../modules/helpers/DateHelper';

const { ObjectId } = mongodb;

const activeSessionDays = 2;
const deleteSessionsAfter = 30;

class AuthenticationServices {
  DB = null;

  constructor(authDb) {
    this.DB = authDb;
  }

  async add(newAuthentication) {
    await this.DB.insertOne(newAuthentication);
    return newAuthentication._id;
  }

  async getById(_id) {
    if (!ObjectId.isValid(_id)) return null;
    return this.DB.findOne({ _id: ObjectId(_id) });
  }

  async getAll() {
    return this.DB.find({}).toArray();
  }

  async removeOld() {
    return this.DB.deleteMany({
      lastActivity: { $lt: DateHelper.getBefore({ days: deleteSessionsAfter }) },
    });
  }

  prepareAuthenticationSession(userId, ctx) {
    const { userAgent, request } = ctx;
    const { ip } = request;
    const { _agent } = userAgent;
    return {
      userId,
      userAgent: {
        requestIp: ip,
        ..._agent,
      },
      active: true,
      lastActivity: DateHelper.getNow(),
      createdAt: DateHelper.getNow(),
    };
  }

  async checkAuthenticated(token) {
    const existingAuthentication = await this.getById(token);
    if (
      existingAuthentication
      && existingAuthentication.active
      && DateHelper.getBefore({ days: activeSessionDays })
      < existingAuthentication.lastActivity
    ) { return existingAuthentication; }
    return false;
  }

  async updateLastActivity(_id) {
    return this.DB.updateOne({ _id }, {
      $set: {
        lastActivity: DateHelper.getNow(),
      },
    });
  }

  async checkAndUpdateActivity(token) {
    const updateReport = await this.DB.findOneAndUpdate(
      {
        _id: ObjectId(token),
        active: true,
        lastActivity: { $gte: DateHelper.getBefore({ days: activeSessionDays }) },
      },
      {
        $set: {
          lastActivity: DateHelper.getNow(),
        },
      },
      {
        projection: {
          userId: 1,
        },
        returnNewDocument: true,
      },
    );
    return updateReport.value ? updateReport.value.userId : null;
  }

  async deactivateAuthentication(_id) {
    return this.DB.updateOne({ _id: ObjectId(_id) }, {
      $set: {
        active: false,
      },
    });
  }

  async getUserByToken(ctx, token) {
    const session = await this.checkAuthenticated(token);
    if (session) {
      await this.updateLastActivity(session._id);
      return ctx.libS.users.getById(session.userId, {});
    }
    return null;
  }

  async getActiveUserByToken(ctx, token) {
    const userId = await this.checkAndUpdateActivity(token);
    if (userId) {
      return ctx.libS.users.getActiveById(userId, {});
    }
    return null;
  }
}

export default AuthenticationServices;
