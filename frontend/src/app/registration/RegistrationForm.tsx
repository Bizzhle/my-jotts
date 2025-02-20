import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { isApiError, registerUser } from "../api-service/services/auth-service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export interface RegisterData {
  emailAddress: string;
  password: string;
  confirmPassword: string;
}
export default function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>("");
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage);
    }
  };

  const validatePasswordMatch = (value: string) => {
    const password = watch("password");
    return value === password || "Passwords do not match";
  };

  return (
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
        {...register("emailAddress", { required: "email must not be empty" })}
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
        {...register("password", { required: "password must not be empty" })}
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
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
