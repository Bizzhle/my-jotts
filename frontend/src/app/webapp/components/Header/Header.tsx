import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Popper,
  Grow,
  MenuList,
  Paper,
  ClickAwayListener,
  ButtonGroup,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchBar from "../SearchBar";
import { AccountCircle, SummarizeTwoTone } from "@mui/icons-material";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useActivities } from "../../utils/contexts/ActivityContext";

interface HeaderProps {
  setOpenNavigation: (value: boolean) => void;
  openNavigation: boolean;
}

export default function Header({
  setOpenNavigation,
  openNavigation,
}: HeaderProps) {
  const { logoutUser } = useAuth();
  const { categories } = useActivities();
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

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        color="primary"
      >
        <Container sx={{ maxWidth: { md: "xl" } }}>
          <Toolbar>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            {isMobile && (
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ mr: 2, opacity: 0.6, color: "inherit" }}
              />
            )}
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                {isMobile ? <SummarizeTwoTone /> : "Jotta"}
              </Link>
            </Typography>
            <SearchBar />
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ButtonGroup variant="text" ref={anchorRef}>
                  <Button color="inherit" onClick={handleToggle}>
                    Categories
                  </Button>
                </ButtonGroup>
                <Popper
                  sx={{ zIndex: 1, pt: 2 }}
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
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
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

            {!isMobile && (
              <Box sx={{ flexGrow: 0, ml: 2 }}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  sx={{ mt: "40px" }}
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
                      to="/subscribe"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Subscribe
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
