import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ApiHandler, isApiError } from "../api-service/ApiRequestManager";
import { RegisterData } from "../api-service/dtos/registration.dto";

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

  const onSubmit = async (data: RegisterData) => {
    try {
      await ApiHandler.registerUser(data);
      setSuccessMessage(
        "Registration successful, check your email to verify your account"
      );
      setError("");
    } catch (err) {
      const errorMessage = isApiError(err);
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
          <TextField
            fullWidth
            label="email address"
            type="email"
            variant="outlined"
            {...register("emailAddress", {
              required: "email must not be empty",
            })}
            error={!!errors.emailAddress}
            helperText={errors.emailAddress?.message}
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
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
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
