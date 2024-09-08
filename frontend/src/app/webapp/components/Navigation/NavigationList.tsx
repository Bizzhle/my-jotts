import { NavigationData } from "./NavigationData";
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
import { useAuth } from "../../utils/contexts/AuthContext";

interface NavigationListProps {
  toggle: () => void;
}

export default function NavigationList({ toggle }: NavigationListProps) {
  const { logoutUser } = useAuth();
  return (
    <List sx={{ width: 230 }}>
      {NavigationData.map((item, index) => (
        <Link to={item.path} key={index}>
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
