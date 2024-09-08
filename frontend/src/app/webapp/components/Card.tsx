import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from "@mui/material";
import { ActivityResponseDto } from "../../api-service/dtos/activity.dto";
import { Link, useNavigate } from "react-router-dom";

import useS3Image from "../utils/hooks/useS3Image";

interface CardProps {
  value: ActivityResponseDto;
}

export default function ActivityCard({ value }: CardProps) {
  const navigate = useNavigate();
  const imageUrl = useS3Image(value.imageUrls?.[0]);

  const handleCardClick = () => {
    navigate(`/activity/${value.id}`);
  };

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "row", md: "row" },
        border: "0.2px solid black",
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        image={imageUrl[0]}
        alt={value.activityTitle}
        sx={{
          maxWidth: 120,
          height: 120,
          objectFit: "cover",
          typography: "body2",
        }}
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          p: 1,
        }}
      >
        <Typography sx={{ typography: { xs: "body2", sm: "body1" } }}>
          {value.activityTitle}
        </Typography>
        <Rating name="rating" value={value.rating} readOnly />
        <Box onClick={(e) => e.stopPropagation()}>
          <Link to={`/categories/${value.categoryName}`}>
            <Chip
              sx={{
                maxWidth: "fit-content",
                typography: { xs: "body2", sm: "body1" },
              }}
              label={value.categoryName}
              variant="outlined"
              clickable
            />
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
