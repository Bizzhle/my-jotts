import { Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
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
    <Paper
      sx={{ width: { xs: 350, md: 400 }, border: "1px solid orange", p: 2 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ mb: 2 }}>Create an account</Typography>
        <TextField
          fullWidth
          label="email address"
          type="email"
          {...register("emailAddress", { required: "email must not be empty" })}
          error={!!errors.emailAddress}
          helperText={errors.emailAddress?.message}
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
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          {...register("confirmPassword", {
            required: "password must not be empty",
            validate: validatePasswordMatch,
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Box>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            fullWidth={true}
            type="submit"
          >
            Submit
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography>
            Already have an account? <Link href="/login">Sign in</Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
