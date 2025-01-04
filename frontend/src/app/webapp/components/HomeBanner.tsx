import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
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
      <Typography variant="h6" color="secondary">
        MyJotts
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
            <Fab size="small" onClick={handleMenu}>
              <Add />
            </Fab>
            <Menu
              sx={{ mt: 5 }}
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
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleButtonClick(setActivityFormOpen)}>
                <Typography variant="body1">Add activity</Typography>
              </MenuItem>

              <MenuItem onClick={handleButtonClick(setCategoryFormOpen)}>
                <Typography variant="body1">Add category</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <>
            <Button
              startIcon={<Add />}
              variant="outlined"
              color="secondary"
              sx={{ mr: 2 }}
              onClick={handleButtonClick(setActivityFormOpen)}
            >
              Activity
            </Button>
            <Button
              startIcon={<Add />}
              variant="outlined"
              color="secondary"
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
