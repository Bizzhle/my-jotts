import {
  AccountCircleRounded,
  CardMembership,
  Dashboard,
  Home,
  PlaylistAddCheckCircleRounded,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Role } from "../Dashboard/roles";

export interface NavigationDataList {
  title: string;
  path: string;
  icon?: JSX.Element;
  requiredPermission?: Role;
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
    requiredPermission: "admin",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: (
      <IconButton color="secondary" size="large">
        <Dashboard />
      </IconButton>
    ),
    requiredPermission: "admin",
  },
];
