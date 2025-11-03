import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBetterAuth } from "./hooks/useBetterAuth";

export function AuthRedirect() {
  const { authenticatedUser, isLoading, session } = useBetterAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if ((!isLoading && authenticatedUser) || session) {
      navigate(from, { replace: true });
    }
  }, [isLoading, authenticatedUser, from, navigate, session]);

  return null;
}
