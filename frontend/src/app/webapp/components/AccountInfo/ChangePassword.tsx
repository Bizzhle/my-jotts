import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  changePassword,
  isApiError,
} from "../../../api-service/services/auth-service";

export interface ResetPasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePassword = () => {
  const [error, setError] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      await changePassword(data);
      setSuccessMessage("Password changed successfully");
      reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errorMessage = isApiError(error);
      setError(errorMessage);
    }
  };

  const validatePasswordMatch = (value: string) => {
    const password = watch("newPassword");
    return value === password || "Passwords do not match";
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          maxWidth: 500,
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 2 },
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Reset Password
          </Typography>
          {successMessage && (
            <Typography variant="body1" color="success" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Old password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("oldPassword", {
              required: "password must not be empty",
            })}
            error={!!errors.oldPassword}
            helperText={errors.newPassword?.message}
            color="secondary"
          />
          <TextField
            fullWidth
            label="New password"
            type="password"
            variant="outlined"
            margin="dense"
            {...register("newPassword", {
              required: "password must not be empty",
            })}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
            color="secondary"
          />
          <TextField
            fullWidth
            label="Confirm new password"
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
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
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
            Reset password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
