import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  isApiError,
  login,
  refreshToken,
  registrationData,
} from "../api-service/services/auth-service";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../webapp/utils/contexts/AuthContext";
import { SessionState } from "../libs/SessionState";

type LoginData = {
  emailAddress: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | undefined>("");
  const { getUserInfo, startSession, authenticatedUser } =
    useContext(AuthContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginData>();

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data: registrationData) => {
    try {
      const response = await login(data);
      SessionState.accessToken = response?.accessToken;
      SessionState.refreshToken = response?.refreshToken;

      await startSession({
        emailAddress: response?.emailAddress,
        accessToken: response?.accessToken,
        refreshToken: response?.refreshToken,
      });

      await getUserInfo();
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage);
    }
  };

  const handleReload = async () => {
    const session = SessionState.refreshToken;

    if (session) {
      const response = await refreshToken();

      SessionState.accessToken = response?.accessToken;
      SessionState.refreshToken = response?.refreshToken;

      await startSession({
        accessToken: response?.accessToken,
        refreshToken: response?.refreshToken,
      });

      await getUserInfo();
    }
  };

  useEffect(() => {
    handleReload();
    if (authenticatedUser) {
      navigate(from, { replace: true });
    }
  }, [authenticatedUser]);

  return (
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
      <Typography sx={{ mb: 2 }}>Sign In</Typography>
      <TextField
        fullWidth
        label="email address"
        type="email"
        {...register("emailAddress")}
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
      {error && (
        <Typography color="error" variant="body2">
          Username or password is wrong, please try again
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
        Register {""}
        <Link href="/register" color="#108BE3">
          here
        </Link>{" "}
        if you do not have an account
      </Typography>
    </Box>
  );
}
