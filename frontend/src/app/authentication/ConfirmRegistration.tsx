import { Box, Container, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../libs/betterAuthClient";

export const ConfirmRegistration = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  async function verify(token: string) {
    try {
      const { data, error } = await verifyEmail({
        query: { token },
      });
      if (error) throw error;

      if (data) setMessage("Successful");

      // Optionally redirect after success
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrorMessage("error");
    }
  }

  useEffect(() => {
    if (token) {
      verify(token);
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
