import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { isApiError } from "../api-service/ApiRequestManager";
import { authClient } from "../libs/betterAuthClient";
import { useBetterAuth } from "../webapp/utils/contexts/hooks/useBetterAuth";

type LoginData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | undefined>("");
  const { startSession, storeLoginError, loginError } = useBetterAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginData>();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (params: LoginData) => {
    try {
      const { error } = await authClient.signIn.email({
        email: params.email,
        password: params.password,
      });

      if (error?.message) {
        await storeLoginError(error.message);
      }
      const { data } = await authClient.getSession();

      if (data) {
        await startSession(data.user);
      }

      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage =
        isApiError(err) || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          flexGrow: 1,
          border: "2px solid orange",
          p: { xs: 2, md: 2 },
        }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography sx={{ mb: 2 }}>Log in</Typography>
        {error && !loginError && (
          <Typography sx={{ mb: 2 }} color="error" variant="body2">
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          label="email address"
          type="email"
          {...register("email")}
          color="secondary"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          {...register("password", { required: true })}
          error={!!errors.password}
          helperText={errors.password?.message}
          color="secondary"
        />
        {loginError && (
          <Typography color="error" variant="body2">
            {loginError}
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
          Submit
        </Button>

        <Typography sx={{ textAlign: "center", mt: 2 }}>
          <Link href="/forgot-password" color="#108BE3">
            Forgot password
          </Link>{" "}
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Do not have an account?{" "}
        </Typography>
        <Link href="/register" color="primary">
          Create an account
        </Link>
      </Box>
    </>
  );
}
