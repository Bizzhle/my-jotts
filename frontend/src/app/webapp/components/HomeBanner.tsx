import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Fab,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

interface HomeBannerProps {
  setActivityFormOpen: Dispatch<SetStateAction<boolean>>;
  setCategoryFormOpen: Dispatch<SetStateAction<boolean>>;
}
export default function HomeBanner({
  setActivityFormOpen,
  setCategoryFormOpen,
}: HomeBannerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleButtonClick =
    (setter: Dispatch<SetStateAction<boolean>>) => () => {
      setter(true);
      handleClose();
    };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" color="primary.main">
        Jotta
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: { xs: "space-around", md: "space-between" },
          alignItems: "center",
          width: "auto",
        }}
      >
        {isMobile ? (
          <Box sx={{ flexGrow: 0 }}>
            <Fab size="small" color="primary" onClick={handleMenu}>
              <Add />
            </Fab>
            <Menu
              sx={{ mt: 6 }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleButtonClick(setActivityFormOpen)}>
                <Typography>Add Activity</Typography>
              </MenuItem>
              <Divider sx={{ my: 0 }} />
              <MenuItem onClick={handleButtonClick(setCategoryFormOpen)}>
                Add Category
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
            <Button
              startIcon={<Add />}
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={handleButtonClick(setActivityFormOpen)}
            >
              Activity
            </Button>
            <Button
              startIcon={<Add />}
              variant="outlined"
              onClick={handleButtonClick(setCategoryFormOpen)}
            >
              Category
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
