import { Box, Container } from "@mui/material";
import Banner from "./Banner";
import RegistrationForm from "./RegistrationForm";

export default function Register() {
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
        <RegistrationForm />
      </Box>
    </Container>
  );
}
