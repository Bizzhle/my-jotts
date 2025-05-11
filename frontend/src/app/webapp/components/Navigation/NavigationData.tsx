import {
  AccountCircleRounded,
  CardMembership,
  Home,
  PlaylistAddCheckCircleRounded,
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
    path: "/myAccount",
    icon: (
      <IconButton color="secondary" size="large">
        <AccountCircleRounded />
      </IconButton>
    ),
  },
  {
    title: "Subscription",
    path: "/subscription",
    icon: (
      <IconButton color="secondary" size="large">
        <CardMembership />
      </IconButton>
    ),
  },
];
