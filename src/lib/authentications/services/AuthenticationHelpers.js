import DateHelper from '#modules/helpers/DateHelper';

const AuthenticationHelpers = {
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
  },
};

export default AuthenticationHelpers;
