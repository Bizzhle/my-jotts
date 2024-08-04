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
          justifyContent: "space-between",
        }}
      >
        <Banner />
        <LoginForm />
      </Box>
    </Container>
  );
}
