import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const SubscriptionCard = () => {
  return (
    <Card
      sx={{
        width: 400,

        borderRadius: 2,
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your subscriptions and billing
        </Typography>
        <Box mt={2}>
          <Typography variant="body1" component="div">
            Subscriptions
          </Typography>
          <Typography variant="body2" sx={{ color: "#b0b0b5" }}>
            Disney+ Standard ( monthly subscription )
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Manage your subscription settings in your iTunes account.
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          href="https://www.apple.com/itunes/" // Replace with actual link
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          sx={{
            bgcolor: "#1f7ae0", // Matching the button color to the blue in the image
            "&:hover": { bgcolor: "#1764b8" },
          }}
        >
          Manage on iTunes
        </Button>
      </Box>
    </Card>
  );
};

export default SubscriptionCard;
