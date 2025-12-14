import { AccountCircle, Search } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import checkUserPermission from "../../../libs/auth/CheckUserPermission";
import { useActivities } from "../../utils/contexts/hooks/useActivities";
import { useBetterAuth } from "../../utils/contexts/hooks/useBetterAuth";
import SearchBar from "../SearchBar";

interface HeaderProps {
  setOpenNavigation: (value: boolean) => void;
  openNavigation: boolean;
  displayNavigation?: boolean;
  displaySearchBar?: boolean;
  displayHeader?: boolean;
  openSearchBar?: boolean;
  handleSearchBar: () => void;
}

export default function Header({
  setOpenNavigation,
  openNavigation,
  displayNavigation,
  displaySearchBar,
  displayHeader,
  openSearchBar,
  handleSearchBar,
}: HeaderProps) {
  const { logoutUser, authenticatedUser } = useBetterAuth();
  const { categories, searchQuery, findActivity, reloadActivity } =
    useActivities();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const hasPermission = checkUserPermission(authenticatedUser, "admin");
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
    setSelectedIndex(null);
  };

  const handleAccountMenuClose = (url?: string) => {
    setAnchorEl(null);
    if (url) {
      navigate(url);
    }
  };

  const handleReloadActivity = async () => {
    await reloadActivity();
    setSelectedIndex(null);
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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
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
            <Typography
              variant="h6"
              color="secondary.dark"
              noWrap
              sx={{ flexGrow: { sm: 1 } }}
            >
              <Link
                to="/"
                style={{ color: "inherit", textDecoration: "none" }}
                onClick={handleReloadActivity}
              >
                MYJOTTS
              </Link>
            </Typography>
          )}
        </Box>
        <Box>
          {displayHeader && isMobile ? (
            <Typography variant="h6" color="secondary.dark">
              <Link
                to="/"
                style={{ color: "inherit", textDecoration: "none" }}
                onClick={handleReloadActivity}
              >
                MYJOTTS
              </Link>
            </Typography>
          ) : displaySearchBar ? (
            <SearchBar
              searchQuery={searchQuery}
              handleSearchChange={findActivity}
            />
          ) : null}
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          {displaySearchBar && isMobile && (
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={handleSearchBar}
              sx={{ borderRadius: 1 }}
            >
              <Search fontSize="medium" />
            </IconButton>
          )}
          {!isMobile && displayNavigation && (
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              <ButtonGroup variant="text" ref={anchorRef}>
                <Button
                  sx={{
                    backgroundColor: "primary.main",
                    color: "secondary.dark",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      color: "secondary.dark",
                    },
                  }}
                  onClick={handleToggle}
                >
                  Categories
                </Button>
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
                          <MenuItem onClick={() => navigate("/categories")}>
                            All Categories
                          </MenuItem>
                          {categories.map((category, index) => (
                            <Link
                              to={`/categories/${category.id}`}
                              key={index}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              <MenuItem
                                // disabled={index === selectedIndex}
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
                onClose={() => handleAccountMenuClose()}
              >
                <MenuItem onClick={() => handleAccountMenuClose("/myAccount")}>
                  Account
                </MenuItem>
                <MenuItem
                  onClick={() => handleAccountMenuClose("/subscription")}
                >
                  Subscription
                </MenuItem>
                {hasPermission && (
                  <MenuItem
                    onClick={() => handleAccountMenuClose("/dashboard")}
                  >
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleAccountMenuClose("/contact-us")}>
                  Contact Us
                </MenuItem>

                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
      {openSearchBar && displaySearchBar && (
        <Toolbar>
          <SearchBar
            searchQuery={searchQuery}
            handleSearchChange={findActivity}
          />
        </Toolbar>
      )}
    </AppBar>
  );
}
