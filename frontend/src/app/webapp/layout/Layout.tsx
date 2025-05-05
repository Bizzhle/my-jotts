import { Box, Container, Toolbar } from "@mui/material";
import { useCallback, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import { LayoutContext } from "./LayoutContext";

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  const { displayHeader, displayNavigation, displaySearchBar } =
    useContext(LayoutContext);

  const handleClose = useCallback(() => {
    if (openNavigation) {
      setOpenNavigation(false);
    }
    if (openSearchBar) {
      handleSearchBar();
    }
  }, [openNavigation, openSearchBar]);

  const handleSearchBar = () => {
    setOpenSearchBar((prevOpen) => !prevOpen);
  };

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
        displaySearchBar={displaySearchBar}
        displayHeader={displayHeader}
        openSearchBar={openSearchBar}
        handleSearchBar={handleSearchBar}
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
            mt: 4,
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
