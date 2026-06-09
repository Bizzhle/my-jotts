import { Button, Container } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      <Typography>This page does not exist.</Typography>
      <Button href="/" variant="contained" sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </Container>
  );
}
