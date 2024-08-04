import { Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  login,
  refreshToken,
  registrationData,
} from "../api-service/services/auth-service";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, SessionInfo } from "../webapp/utils/contexts/AuthContext";
import { SessionState } from "../libs/SessionState";
import { error } from "console";

type LoginData = {
  emailAddress: string;
  password: string;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfo, startSession } = useContext(AuthContext);
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

      if (response?.emailAddress) {
        const sessionInfo: SessionInfo = {
          emailAddress: response.emailAddress,
        };
        await startSession(sessionInfo);
      }

      await getUserInfo();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: registrationData) => {
    await handleLogin(data);
  };

  const handleReload = async () => {
    const session = SessionState.refreshToken;

    if (session) {
      const response = await refreshToken();
      console.log(response);

      SessionState.accessToken = response?.hashedAccessToken;
      SessionState.refreshToken = response?.refreshToken;
      console.log("got here");

      await getUserInfo();
    }
  };

  useEffect(() => {
    handleReload();
  }, []);

  return (
    <Paper sx={{ width: 300, border: "1px solid red", p: 5 }}>
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

        <Box sx={{ textAlign: "center", mt: 2 }}>
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
            <Link href="/register">Register here</Link> if you do not have an
            account
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
