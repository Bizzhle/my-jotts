import { Box, Button, Link, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { registerUser } from "../api-service/services/auth-service";
import { useNavigate } from "react-router-dom";

export interface RegisterData {
  emailAddress: string;
  password: string;
  confirmPassword: string;
}
export default function RegistrationForm() {
  const navigate = useNavigate();
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
      console.log(err);
    }
  };

  const validatePasswordMatch = (value: string) => {
    const password = watch("password");
    return value === password || "Passwords do not match";
  };

  return (
    <Paper sx={{ width: 300, border: "1px solid red", p: 5 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ mb: 2 }}>Create an account</Typography>
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
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          {...register("confirmPassword", {
            required: true,
            validate: validatePasswordMatch,
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
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
