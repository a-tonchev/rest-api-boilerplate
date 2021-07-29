import { UserRoles } from '#lib/users/enums/UserEnums';

const AuthorizationCheck = {
  isAdmin(ctx) {
    const { user } = ctx.privateState;
    return user && user.roles.includes(UserRoles.ADMIN);
  },
};

export default AuthorizationCheck;
