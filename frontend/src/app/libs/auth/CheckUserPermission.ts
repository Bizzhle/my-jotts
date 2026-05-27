import { Role } from "../../features/dashboard/roles";
import { User } from "../../contexts/BetterAuthContext";

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
