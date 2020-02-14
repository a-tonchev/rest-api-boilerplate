import Users from '../../api/users/Users';
import Authentications from '../../api/authentications/Authentications';

const setupDatabase = async (ctx, next) => {
  ctx.databases = {
    users: Users(),
    authentications: Authentications(),
  };
  try {
    await next();
  } finally {
    ctx.services = null;
  }
};

export default setupDatabase;
