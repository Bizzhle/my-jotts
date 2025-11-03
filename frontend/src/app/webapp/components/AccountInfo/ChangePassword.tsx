import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isApiError } from "../../../api-service/ApiRequestManager";
import { authClient } from "../../../libs/betterAuthClient";
import { LayoutContext } from "../../layout/LayoutContext";

export interface ResetPasswordData {
  currentPassword: string;
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
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function storeError(error: string) {
    setError(error);
  }

  const onSubmit = async (param: ResetPasswordData) => {
    try {
      const { data, error } = await authClient.changePassword({
        newPassword: param.newPassword,
        currentPassword: param.currentPassword,
        revokeOtherSessions: true,
      });
      if (data) {
        setSuccessMessage("Password changed successfully");
      }
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (error?.message) {
        await storeError(error.message);
      }
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
            Change Password
          </Typography>
          {successMessage && (
            <Typography variant="body1" color="success.main" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
          <TextField
            fullWidth
            label="Current password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("currentPassword", {
              required: "password must not be empty",
            })}
            error={!!errors.currentPassword}
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
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
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
            Change password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
