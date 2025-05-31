import { Box, CircularProgress } from "@mui/material";
import { ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../webapp/utils/contexts/AuthContext";

interface ProtectedLoaderProps {
  children: ReactNode;
}

export const ProtectedRoutes = ({ children }: ProtectedLoaderProps) => {
  const { authenticatedUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress color="info" />
      </Box>
    );
  }

  return authenticatedUser ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
