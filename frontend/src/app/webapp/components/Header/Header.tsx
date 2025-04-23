import {
  AccountCircle,
  PlaylistAddCheckCircleRounded,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useActivities } from "../../utils/contexts/ActivityContext";
import { useAuth } from "../../utils/contexts/AuthContext";
import SearchBar from "../SearchBar";

interface HeaderProps {
  setOpenNavigation: (value: boolean) => void;
  openNavigation: boolean;
  displayNavigation?: boolean;
}

export default function Header({
  setOpenNavigation,
  openNavigation,
  displayNavigation,
}: HeaderProps) {
  const { logoutUser } = useAuth();
  const { categories, searchQuery, findActivity, reloadActivity } =
    useActivities();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuOpen = () => {
    setOpenNavigation(!openNavigation);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleAcountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReloadActivity = async () => {
    await reloadActivity();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 0,
        borderBottom: "1px solid black",
      }}
    >
      <Toolbar>
        {isMobile && displayNavigation ? (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ borderRadius: 1 }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "none" }}
              onClick={handleReloadActivity}
            >
              <Typography variant="h6" color="secondary.dark">
                MYJOTTS
              </Typography>
            </Link>
          </Typography>
        )}

        {displayNavigation && (
          <SearchBar
            searchQuery={searchQuery}
            handleSearchChange={findActivity}
          />
        )}

        {!isMobile && displayNavigation && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <ButtonGroup variant="text" ref={anchorRef}>
              <Tooltip
                title="categories"
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -14],
                        },
                      },
                    ],
                  },
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="categories"
                  onClick={handleToggle}
                  sx={{ borderRadius: 1 }}
                >
                  <PlaylistAddCheckCircleRounded fontSize="medium" />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
            <Popper
              sx={{ zIndex: 1, mt: "45px", minWidth: 150 }}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        {categories.map((category, index) => (
                          <Link
                            to={`/categories/${category.categoryName}`}
                            key={index}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <MenuItem
                              disabled={index === 2}
                              selected={index === selectedIndex}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
                            >
                              {category.categoryName}
                            </MenuItem>
                          </Link>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        )}

        {!isMobile && displayNavigation && (
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
              onClose={handleAcountMenuClose}
            >
              <MenuItem onClick={handleAcountMenuClose}>
                <Link
                  to="/myaccount"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Account
                </Link>
              </MenuItem>
              <MenuItem onClick={handleAcountMenuClose}>
                <Link
                  to="/subscription"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Subscription
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
