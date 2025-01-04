import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const getErrorMessage = (error: string) => {
  switch (error) {
    case "Maximum activities":
      return (
        <Typography color="warning" variant="body1">
          You have reached the maximum allowed activities. Click{" "}
          <Link to="/subscription">here</Link> to subscribe as a premium user to
          add more activities.
        </Typography>
      );
    case "Maximum categories":
      return (
        <Typography color="warning" variant="body1">
          You have reached the maximum allowed categories. Click{" "}
          <Link to="/subscription">here</Link> to subscribe as a premium user to
          add more categories.
        </Typography>
      );
    case "Maximum images":
      return (
        <Typography color="warning" variant="body1">
          You are only allowed 1 image upload. Click{" "}
          <Link to="/subscription">here</Link> to subscribe as a premium user to
          add more images.
        </Typography>
      );
    default:
      return (
        <Typography color="error" variant="body1">
          {error} Please try again.
        </Typography>
      );
  }
};
