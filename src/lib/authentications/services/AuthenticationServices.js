import mongodb from 'mongodb';

import DateHelper from '#modules/helpers/DateHelper';
import ServicesBase from '#lib/base/services/ServicesBase';
import AuthenticationHelpers from '#lib/authentications/services/AuthenticationHelpers';

const { ObjectId } = mongodb;

const activeSessionDays = 2;

class AuthenticationServices extends ServicesBase {
  helpers = {
    ...super.getHelpers(),
    ...AuthenticationHelpers,
  };

  async add(newAuthentication) {
    await this.DB.insertOne(newAuthentication);
    return newAuthentication._id;
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
    return updateReport.value?.userId;
  }

  async deactivateAuthentication(_id) {
    return this.DB.updateOne({ _id: ObjectId(_id) }, {
      $set: {
        active: false,
      },
    });
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
