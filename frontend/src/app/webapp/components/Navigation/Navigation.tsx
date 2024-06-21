import { Box, Drawer, Toolbar } from "@mui/material";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const drawerStyle = {
    width: 300,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      boxSizing: "border-box",
      width: 300,
      borderRight: "3px solid grey",
    },
  };
  return (
    <>
      <Drawer sx={drawerStyle} open={isOpen} variant="permanent">
        <Toolbar />
        <Box>
          <p>Nav</p>
        </Box>
      </Drawer>
    </>
  );
}
