import { Role } from "../../webapp/components/Dashboard/roles";
import { User } from "../../webapp/utils/contexts/BetterAuthContext";

const checkUserPermission = (
  authenticatedUser: User | undefined,
  requiredRole: Role
) => {
  if (authenticatedUser) {
    return authenticatedUser.role === requiredRole;
  }
  return false;
};
export default checkUserPermission;
