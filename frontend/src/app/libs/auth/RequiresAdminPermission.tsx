import { Navigate } from "react-router-dom";
import { useBetterAuth } from "../../contexts/hooks/useBetterAuth";

interface RequiresAdminPermissionProps {
  children: React.ReactNode;
}
export const RequiresAdminPermission = ({
  children,
}: RequiresAdminPermissionProps) => {
  const { authenticatedUser, isLoading } = useBetterAuth();
  const userRole = authenticatedUser?.role?.includes("admin") || "";

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};
