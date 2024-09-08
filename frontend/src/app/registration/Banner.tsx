import { Box, Grid, Typography } from "@mui/material";

export default function Banner() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid>
        <Typography variant="h4">Moments, Activities in your Jotta</Typography>
        <Typography variant="body1">
          Jot moments, locations and all other activities with images and
          reviews, browse through easily when revisiting activities to remind
          yourself of previous experiences.
        </Typography>
      </Grid>
    </Box>
  );
}
