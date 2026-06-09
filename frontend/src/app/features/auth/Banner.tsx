import { Box, Grid, Typography } from "@mui/material";

export default function Banner() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 320,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 4,
        boxShadow: 2,
        p: 2,
      }}
    >
      <Grid>
        <Typography variant="h4">Moments & Activities in Your Jotta</Typography>
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, mb: 2, color: "text.secondary", fontWeight: 500 }}
        >
          Your digital journal for capturing, organizing, and reliving life’s
          best moments.
        </Typography>
        <Typography variant="body1">
          Capture moments, locations, and every activity—add images and reviews
          to bring your memories to life. Effortlessly browse your past
          experiences and revisit activities to relive and reflect on your
          favorite memories.
        </Typography>
      </Grid>
    </Box>
  );
}
