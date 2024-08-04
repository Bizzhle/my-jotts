import { NavigationData } from "./NavigationData";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function () {
  return (
    <List>
      {NavigationData.map((item, index) => (
        <Link to={item.path} key={index}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
    </List>
  );
}
