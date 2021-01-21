import { UserRoles } from '../../lib/users/enums/UserEnums';

export default class AuthorizationCheck {
  static isAdmin(ctx) {
    const { user } = ctx.state;
    return user && user.roles.includes(UserRoles.ADMIN);
  }
}
