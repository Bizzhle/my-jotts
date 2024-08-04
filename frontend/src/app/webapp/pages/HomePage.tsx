import { Typography } from "@mui/material";
import { AuthContext } from "../utils/contexts/AuthContext";
import { useContext } from "react";

export default function HomePage() {
  const { authenticatedUser } = useContext(AuthContext);

  console.log(authenticatedUser);
  return (
    <Typography>
      HomePageggsgsgsgsgsahsgagsgagagagaggag sjhasasgggsggsgs
    </Typography>
  );
}
