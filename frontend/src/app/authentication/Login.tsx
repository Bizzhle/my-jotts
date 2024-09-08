import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import Banner from "../registration/Banner";
import LoginForm from "./LoginForm";

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 4, // Add some padding to the top and bottom
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 1000, // Limit the maximum width
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            maxWidth: 500,
          }}
        >
          <Banner />
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            maxWidth: 400,
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </Container>
  );
}
