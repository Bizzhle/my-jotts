import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ApiHandler, isApiError } from "../api-service/ApiRequestManager";
import { LayoutContext } from "../webapp/layout/LayoutContext";

export interface ForgotPasswordData {
  emailAddress: string;
}

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");
  const { handleSubmit, register, reset } = useForm<ForgotPasswordData>();
  const { hideNavigation, hideSearchBar, hideHeader } =
    useContext(LayoutContext);

  useEffect(() => {
    hideNavigation();
    hideHeader();
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const response = await ApiHandler.forgotPassword(data);
      reset({
        emailAddress: "",
      });
      setError("");
      setSuccessMessage(response.message);
    } catch (error) {
      const errorMessage = isApiError(error);
      setError(errorMessage);
    }
  };

  if (successMessage) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="success.main" sx={{ my: 1 }}>
            {successMessage}
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            log in again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flexGrow: 1,
            border: "2px solid orange",
            p: { xs: 2, md: 2 },
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Request New Password
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Please enter your email address to receive a password reset link.
          </Typography>

          <TextField
            fullWidth
            label="email address"
            type="email"
            {...register("emailAddress")}
            color="secondary"
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            size="medium"
            color="primary"
            fullWidth={true}
            type="submit"
            sx={{ textAlign: "center", mt: 1 }}
          >
            Send password reset link
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Typography>Do you already have an account? </Typography>
          <Link
            color="primary"
            href="/login"
            sx={{ textAlign: "center", mt: 1 }}
          >
            Log in
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
