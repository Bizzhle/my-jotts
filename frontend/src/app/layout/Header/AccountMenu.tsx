import { AccountCircle } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { User } from "better-auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import checkUserPermission from "../../libs/auth/CheckUserPermission";

interface AccountMenuProps {
  authenticatedUser?: User;
  displayNavigation?: boolean;
  isMobile: boolean;
  onLogout: () => Promise<void>;
}

export default function AccountMenu({
  authenticatedUser,
  displayNavigation,
  isMobile,
  onLogout,
}: AccountMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const hasPermission = checkUserPermission(authenticatedUser, "admin");

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (url?: string) => {
    setAnchorEl(null);
    if (url) {
      navigate(url);
    }
  };

  const handleLogout = async () => {
    await onLogout();
  };

  if (!displayNavigation || isMobile) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 0, ml: 2 }}>
      <IconButton
        aria-label="account of current user"
        onClick={handleMenu}
        color="inherit"
        sx={{ borderRadius: 1 }}
      >
        <AccountCircle fontSize="medium" />
      </IconButton>
      <Menu
        sx={{
          mt: "45px",
          "& .MuiMenuItem-root": { minWidth: 200 },
        }}
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
        onClose={() => handleMenuClose()}
      >
        <MenuItem onClick={() => handleMenuClose("/myAccount")}>
          Account
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose("/subscription")}>
          Subscription
        </MenuItem>
        {hasPermission && (
          <MenuItem onClick={() => handleMenuClose("/dashboard")}>
            Dashboard
          </MenuItem>
        )}
        <MenuItem onClick={() => handleMenuClose("/contact-us")}>
          Contact Us
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
