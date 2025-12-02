import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { isApiError } from "../api-service/ApiRequestManager";
import { RegisterData } from "../api-service/dtos/registration.dto";
import { authClient } from "../libs/betterAuthClient";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  async function storeError(error: string) {
    setError(error);
  }

  const onSubmit = async (data: RegisterData) => {
    const { email, name, password } = data;
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        name,
        password,
      });
      if (data) {
        setSuccessMessage(
          "Registration successful, check your email to verify your account"
        );
      }

      if (error?.message) {
        await storeError(error.message);
      }
    } catch (err) {
      const errorMessage =
        isApiError(err) || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  const validatePasswordMatch = (value: string) => {
    const password = watch("password");
    return value === password || "Passwords do not match";
  };

  const success = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 2 },
          textAlign: "center",
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
          log in
        </Button>
      </Box>
    );
  };

  return (
    <>
      {successMessage ? (
        success()
      ) : (
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
          <Typography sx={{ mb: 2 }}>Create a new account</Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            label="email address"
            type="email"
            variant="outlined"
            {...register("email", {
              required: "email must not be empty",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            color="secondary"
          />
          <TextField
            fullWidth
            label="name"
            type="name"
            variant="outlined"
            margin="normal"
            {...register("name", {
              required: "name must not be empty",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            color="secondary"
          />
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
          <Button
            variant="contained"
            size="medium"
            color="primary"
            fullWidth={true}
            type="submit"
            sx={{ mt: 1 }}
          >
            Submit
          </Button>
          <Typography sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/login" color="#108BE3">
              Log in
            </Link>
          </Typography>
        </Box>
      )}
    </>
  );
}
