import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 1,
        display: "flex",
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="body2">All rights reserved</Typography>
      <Typography>|</Typography>
      <Typography variant="body2">© 2025 MyJotts</Typography>
      <Typography>|</Typography>

      <Typography
        variant="body2"
        onClick={() => navigate("/contact-us")}
        sx={{ cursor: "pointer" }}
      >
        Contact Us
      </Typography>
    </Box>
  );
}
