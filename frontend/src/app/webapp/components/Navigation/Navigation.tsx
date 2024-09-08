import { Box, Drawer, Toolbar } from "@mui/material";
import NavigationList from "./NavigationList";

interface NavigationProps {
  openNavigation: boolean;
  setOpenNavigation: (value: boolean) => void;
}

export default function Navigation({
  openNavigation,
  setOpenNavigation,
}: NavigationProps) {
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenNavigation(newOpen);
  };

  return (
    <Drawer open={openNavigation} onClose={toggleDrawer(false)} sx={{}}>
      <Toolbar />
      <Box sx={{ marginTop: 3 }}>
        <NavigationList toggle={toggleDrawer(false)} />
      </Box>
    </Drawer>
  );
}
