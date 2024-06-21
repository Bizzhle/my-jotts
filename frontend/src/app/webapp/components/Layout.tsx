import { Box, Grid, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation/Navigation";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <Header />
      <Navigation />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          overflowX: "auto",
        }}
      >
        <Grid
          sx={{
            mx: 3,
            my: 5,
          }}
        >
          <Toolbar />
          <Outlet />
        </Grid>
        <Grid item sx={{ marginTop: "auto" }}>
          <Footer />
        </Grid>
      </Box>
    </>
  );
}

export default Layout;
