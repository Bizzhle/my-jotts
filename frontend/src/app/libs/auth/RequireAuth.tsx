import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { ReactNode, useContext, useEffect } from "react";
import { AuthContext } from "../../webapp/utils/contexts/AuthContext";

// export function RequireAuth({ children }: { children: JSX.Element }) {
//   const { authenticatedUser } = useAuthUser();
//   const location = useLocation();

//   if (!authenticatedUser) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }

interface ProtectedLoaderProps {
  children: ReactNode;
}

export const ProtectedRoutes = ({ children }: ProtectedLoaderProps) => {
  const { authenticatedUser, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  console.log(isAuthenticated);

  if (!authenticatedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
