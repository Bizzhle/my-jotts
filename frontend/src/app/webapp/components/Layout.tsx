import { Box, Container, Toolbar } from "@mui/material";
import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";

interface LayoutProps {
  displayNavigation?: boolean;
  children?: React.ReactNode;
}

function Layout({ displayNavigation, children }: LayoutProps) {
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    if (openNavigation) {
      setOpenNavigation(false);
    }
  }, [openNavigation]);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header
        openNavigation={openNavigation}
        setOpenNavigation={setOpenNavigation}
        displayNavigation={displayNavigation}
      />
      <Navigation
        openNavigation={openNavigation}
        setOpenNavigation={setOpenNavigation}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={handleClose}
      >
        <Toolbar />
        <Box
          sx={{
            px: { xs: 2, sm: 4, md: 6, lg: 8 },
            py: { xs: 4, sm: 4 },
            flexGrow: 1,
          }}
        >
          {children || <Outlet />}
        </Box>
      </Box>
      <Footer />
    </Container>
  );
}

export default Layout;
