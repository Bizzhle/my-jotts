import { useLocation, Navigate } from "react-router-dom";
import { ReactNode, useContext } from "react";
import { AuthContext } from "../../webapp/utils/contexts/AuthContext";

interface ProtectedLoaderProps {
  children: ReactNode;
}

export const ProtectedRoutes = ({ children }: ProtectedLoaderProps) => {
  const { authenticatedUser } = useContext(AuthContext);
  const location = useLocation();

  if (!authenticatedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
