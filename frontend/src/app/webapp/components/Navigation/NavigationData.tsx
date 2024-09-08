import {
  Home,
  PlaylistAddCheckCircleRounded,
  AccountCircleRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface NavigationDataList {
  title: string;
  path: string;
  icon?: JSX.Element;
}

export const NavigationData: NavigationDataList[] = [
  {
    title: "Home",
    path: "/",
    icon: (
      <IconButton color="secondary" size="large">
        <Home />
      </IconButton>
    ),
  },
  {
    title: "Categories",
    path: "/categories",
    icon: (
      <IconButton color="secondary" size="large">
        <PlaylistAddCheckCircleRounded />
      </IconButton>
    ),
  },
  {
    title: "Account",
    path: "/myaccount",
    icon: (
      <IconButton color="secondary" size="large">
        <AccountCircleRounded />
      </IconButton>
    ),
  },
];
