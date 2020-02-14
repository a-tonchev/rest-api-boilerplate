import UserServices from '../../api/users/services/UserServices';
import AuthenticationServices from '../../api/authentications/services/AuthenticationServices';

const setupServices = async (ctx, next) => {
  ctx.services = {
    users: new UserServices(ctx.databases.users),
    authentications: new AuthenticationServices(ctx.databases.authentications),
  };
  try {
    await next();
  } finally {
    ctx.services = null;
  }
};

export default setupServices;
