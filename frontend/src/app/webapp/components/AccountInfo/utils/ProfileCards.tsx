import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

interface ProfileCardsProps {
  title?: string;
  children: React.ReactNode;
}

export default function ProfileCards({ title, children }: ProfileCardsProps) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box sx={{ bgcolor: "primary.main", px: 2, py: 1 }}>
        {title && (
          <Typography color="secondary.main" variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
      </Box>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
