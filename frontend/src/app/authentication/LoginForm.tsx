import { Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
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

  const handleLogin = async (data: registrationData) => {
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

  const onSubmit = async (data: registrationData) => {
    await handleLogin(data);
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
    <Paper
      sx={{ width: { xs: 350, md: 400 }, border: "2px solid orange", p: 2 }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ mb: 2 }}>Log in</Typography>
        <TextField
          fullWidth
          label="email address"
          type="email"
          {...register("emailAddress")}
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
        />
        {error && <Typography color="error">{error}</Typography>}

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            fullWidth={true}
            type="submit"
            disableElevation
          >
            Submit
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography>
            <Link href="/register">Register here</Link> if you do not have an
            account
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
