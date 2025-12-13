import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiHandler, isApiError } from "../../../api-service/ApiRequestManager";
import { SupportDto } from "../../../api-service/dtos/support.dto";
import { useBetterAuth } from "../../utils/contexts/hooks/useBetterAuth";

const contactEmail = import.meta.env.VITE_DOMAIN_EMAIL;
export const Contact = () => {
  const { user } = useBetterAuth();
  const [error, setError] = useState<string | undefined>("");
  const { handleSubmit, register, reset } = useForm<SupportDto>();

  useEffect(() => {
    if (user) {
      reset({ email: user.email, subject: "", description: "" });
    }
  }, [user, reset]);

  const onSubmit = async (data: SupportDto) => {
    try {
      await ApiHandler.sendSupportRequest(data);
      reset();
    } catch (error) {
      const errorMessage = isApiError(error);
      setError(errorMessage);
    }
  };
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5">Support</Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
        If you have questions about the application, problems with registration
        or login, suggestions on how to improve the app, please reach out to us
        at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </Typography>

      <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
        You can also use the below contact form to send us a message directly.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="email address"
            type="email"
            {...register("email")}
            color="secondary"
            required
          />

          <TextField
            fullWidth
            label="subject"
            type="text"
            margin="normal"
            {...register("subject")}
            color="secondary"
            required
          />

          <TextField
            fullWidth
            label="description"
            type="text"
            margin="normal"
            {...register("description")}
            color="secondary"
            multiline
            rows={10}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" sx={{ mt: 2 }} type="submit">
            Send Message
          </Button>
        </form>
      </Box>
    </Container>
  );
};
