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

        <Typography sx={{ textAlign: "left", my: 2 }}>
          <Link
            href="/forgot-password"
            color="#108BE3"
            sx={{ textDecoration: "none" }}
          >
            Forgot password
          </Link>{" "}
        </Typography>

        <Button
          variant="contained"
          size="medium"
          color="primary"
          fullWidth={true}
          type="submit"
          sx={{ textAlign: "center" }}
        >
          Submit
        </Button>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ textAlign: "center", my: 2 }}>
            Do not have an account?{" "}
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/register")}
            color="secondary"
            sx={{
              borderColor: "#0268B0",
              color: "#0268B0",
              fontWeight: 600,
              backgroundColor: "rgba(16, 139, 227, 0.04)",
              "&:hover": {
                borderColor: "#0268B0",
                color: "#0268B0",

                backgroundColor: "rgba(16, 139, 227, 0.04)",
              },
            }}
          >
            Create an account
          </Button>
          <Typography
            onClick={() => navigate("/contact-us")}
            sx={{ cursor: "pointer", mt: 2 }}
          >
            Contact Us
          </Typography>
        </Box>
      </Box>
    </>
  );
}
