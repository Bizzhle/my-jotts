import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import checkUserPermission from "../../../libs/auth/CheckUserPermission";
import { useBetterAuth } from "../../utils/contexts/hooks/useBetterAuth";
import { NavigationData, NavigationDataList } from "./NavigationData";

interface NavigationListProps {
  toggle: () => void;
}

export default function NavigationList({ toggle }: NavigationListProps) {
  const { logoutUser, authenticatedUser } = useBetterAuth();

  function getAllowedNavigationItems(items: ReadonlyArray<NavigationDataList>) {
    // You can implement permission-based filtering here
    return items.filter((item) => {
      if (!item.requiredPermission) return true;
      if (
        item.requiredPermission &&
        !checkUserPermission(authenticatedUser, item.requiredPermission)
      ) {
        return false;
      }
      return true;
    });
  }
  return (
    <List sx={{ width: 230 }}>
      {getAllowedNavigationItems(NavigationData).map((item, index) => (
        <Link
          to={item.path}
          key={index}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding onClick={toggle}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
          <Divider />
        </Link>
      ))}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="contained" onClick={logoutUser}>
          {" "}
          logout{" "}
        </Button>
      </Box>
    </List>
  );
}
