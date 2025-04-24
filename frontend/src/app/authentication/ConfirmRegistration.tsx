import { Box, Container, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  isApiError,
  verifyRegistration,
} from "../api-service/services/auth-service";

export const ConfirmRegistration = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailAddress = searchParams.get("emailAddress");
  const [message, setMessage] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const confirmRegistration = async (
    emailAddress: string,
    verificationToken: string
  ) => {
    try {
      // Call the API to confirm registration
      const response = await verifyRegistration(
        emailAddress,
        verificationToken
      );
      setMessage(response.data.message); // Handle success (e.g., show a success message)
    } catch (error) {
      const errorMessage = isApiError(error);
      setErrorMessage(errorMessage); // Handle error (e.g., show an error message)
    }
  };

  useEffect(() => {
    if (token && emailAddress) {
      confirmRegistration(emailAddress, token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          maxWidth: 500,
        }}
      >
        {message && (
          <Typography
            variant="h5"
            sx={{
              color: "green",
              fontSize: 20,
              marginBottom: 2,
            }}
          >
            {message}
          </Typography>
        )}
        {errorMessage && (
          <Typography
            sx={{
              color: "red",
              fontSize: 16,
              marginBottom: 2,
            }}
          >
            {errorMessage}
          </Typography>
        )}
        {message && (
          <Link height={50} href="/login">
            Login here{" "}
          </Link>
        )}
      </Box>
    </Container>
  );
};
