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
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiHandler, isApiError } from "../api-service/ApiRequestManager";
import { LayoutContext } from "../webapp/layout/LayoutContext";

export interface ResetPasswordData {
  password: string;
  token: string;
  confirmPassword: string;
}

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>();
  const { hideNavigation, hideSearchBar, hideHeader } =
    useContext(LayoutContext);

  useEffect(() => {
    hideNavigation();
    hideSearchBar();
    hideHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      await ApiHandler.resetPassword({ ...data, token: token || "" });
      setSuccessMessage("Password reset successfully");
    } catch (error) {
      const errorMessage = isApiError(error);
      setError(errorMessage); // Handle error (e.g., show an error message)
    }
  };

  const validatePasswordMatch = (value: string) => {
    const password = watch("password");
    return value === password || "Passwords do not match";
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
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              width: "auto",
              px: 2,
            }}
          >
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
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("password", {
              required: "password must not be empty",
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            color="secondary"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="dense"
            {...register("confirmPassword", {
              required: "password must not be empty",
              validate: validatePasswordMatch,
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
            Reset password
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography>Do you already have an account? </Typography>
          <Link href="/login">Log in</Link>
        </Box>
      </Box>
    </Container>
  );
};
