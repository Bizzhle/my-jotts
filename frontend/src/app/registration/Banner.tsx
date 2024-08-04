import { Box, Typography } from "@mui/material";

export default function Banner() {
  return (
    <Box
      sx={{ flex: 1, pr: 4, justifyContent: "center", alignItems: "center" }}
    >
      <Typography variant="h4">Moments, Activities in your Jotta</Typography>
      <Typography variant="body1">
        Jot moments, locations and all other activities with images and reviews,
        browse through easily when revisiting activities to remind yourself of
        previous experiences.
      </Typography>
    </Box>
  );
}
