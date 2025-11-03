import { Box, CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useBetterAuth } from "../../webapp/utils/contexts/hooks/useBetterAuth";

interface ProtectedLoaderProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedLoaderProps) => {
  const { authenticatedUser, isLoading, session } = useBetterAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress color="info" />
      </Box>
    );
  }

  return authenticatedUser || session ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
