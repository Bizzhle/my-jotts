import { Home, Category, Rowing } from "@mui/icons-material";

interface NavigationDataList {
  title: string;
  path: string;
  icon?: unknown;
}

export const NavigationData = [
  {
    title: "Home",
    path: "/",
    icon: <Home />,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: <Category />,
  },
  {
    title: "Activity",
    path: "/activity",
    icon: <Rowing />,
  },

  {
    title: "Logout",
    path: "/logout",
    icon: "",
  },
];
