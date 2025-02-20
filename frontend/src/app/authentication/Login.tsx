import { Box, Container } from "@mui/material";
import Banner from "../registration/Banner";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", lg: "50%" },
            maxWidth: 500,
            mb: { xs: 2, lg: 0 },
          }}
        >
          <Banner />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", lg: "50%" },
            maxWidth: 500,
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </Container>
  );
}
