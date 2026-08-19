import crypto from 'crypto';

import DateHelper from '#modules/helpers/DateHelper';
import ServicesBase from '#lib/base/services/ServicesBase';
import AuthenticationHelpers from '#lib/authentications/services/AuthenticationHelpers';

const activeSessionDays = 2;
const activityWriteThrottleMinutes = 60;

const hashToken = raw => crypto.createHash('sha256').update(raw).digest('hex');

class AuthenticationServices extends ServicesBase {
  helpers = {
    ...super.getHelpers(),
    ...AuthenticationHelpers,
  };

  async add(newAuthentication) {
    const rawToken = crypto.randomBytes(32).toString('base64url');

    await this.DB.insertOne({
      ...newAuthentication,
      tokenHash: hashToken(rawToken),
    });

    return rawToken;
  }

  async checkAndUpdateActivity(token) {
    if (!token || typeof token !== 'string') return null;

    const authentication = await this.DB.findOne(
      {
        tokenHash: hashToken(token),
        active: true,
      },
      {
        projection: {
          userId: 1,
          lastActivity: 1,
        },
      },
    );

    if (!authentication) return null;

    // Fail-closed on purpose: a missing/malformed lastActivity must expire the
    // session, not pass as fresh. This check must stay BEFORE the activity
    // refresh below — refreshing first would resurrect an expired session.
    if (!(authentication.lastActivity >= DateHelper.getBefore({ days: activeSessionDays }))) {
      await this.DB.updateOne(
        { _id: authentication._id },
        {
          $set: {
            active: false,
          },
        },
      );
      return null;
    }

    const staleBefore = DateHelper.getBefore({ minutes: activityWriteThrottleMinutes });

    if (authentication.lastActivity < staleBefore) {
      await this.DB.updateOne(
        {
          _id: authentication._id,
          active: true,
          lastActivity: { $lt: staleBefore },
        },
        {
          $set: {
            lastActivity: DateHelper.getNow(),
          },
        },
      );
    }

    return authentication.userId;
  }

  async deactivateAuthentication(token) {
    if (!token || typeof token !== 'string') return null;

    return this.DB.updateOne({ tokenHash: hashToken(token) }, {
      $set: {
        active: false,
      },
    });
  }

  async getActiveUserByToken(ctx, token) {
    const userId = await this.checkAndUpdateActivity(token);
    if (!userId) return null;

    const user = await ctx.libS.users.getActiveById(userId, {});
    if (!user) {
      // The session resolved but its user is no longer ACTIVE — retire the
      // token, otherwise the activity refresh keeps it alive indefinitely and
      // it would resume working if the account were ever re-activated.
      await this.deactivateAuthentication(token);
      return null;
    }
    return user;
  }
}

export default AuthenticationServices;
