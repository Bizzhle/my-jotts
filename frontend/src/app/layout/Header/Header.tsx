import { Search } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useActivities } from "../../contexts/hooks/useActivities";
import { useBetterAuth } from "../../contexts/hooks/useBetterAuth";
import SearchBar from "../../ui/SearchBar";
import AccountMenu from "./AccountMenu";
import CategoryDropdown from "./CategoryDropdown";

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
  const { categoryId } = useParams<{ categoryId: string }>();
  const { logoutUser, authenticatedUser } = useBetterAuth();
  const {
    categories,
    searchQuery,
    findActivity,
    loadActivities,
    loadActivitiesByCategory,
    fetchCategories,
  } = useActivities();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (categoryId) {
      loadActivitiesByCategory(categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleMenuOpen = () => {
    setOpenNavigation(!openNavigation);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleReloadActivity = async () => {
    await loadActivities();
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
          <CategoryDropdown
            categories={categories}
            displayNavigation={displayNavigation}
            isMobile={isMobile}
            fetchCategories={fetchCategories}
          />
          <AccountMenu
            authenticatedUser={authenticatedUser}
            displayNavigation={displayNavigation}
            isMobile={isMobile}
            onLogout={handleLogout}
          />
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
