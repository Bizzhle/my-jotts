import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ActivityResponseDto } from "../../api-service/dtos/activity.dto";

import { DeleteOutline } from "@mui/icons-material";
import useS3Image from "../utils/hooks/useS3Image";

interface CardProps {
  value: ActivityResponseDto;
  onDELETE: (activityId: number) => void;
}

export default function ActivityCard({ value, onDELETE }: CardProps) {
  const navigate = useNavigate();
  const imageUrl = useS3Image(value.imageUrls?.[0]);

  const handleCardClick = () => {
    navigate(`/activity/${value.id}`);
  };

  return (
    <Box
      sx={{
        border: "0.2px solid black",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
      }}
    >
      <Card
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "row", md: "row" },
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        onClick={handleCardClick}
      >
        {imageUrl.length > 0 && (
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
        )}

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
          <Box sx={{ py: 1 }}>
            <Rating name="rating" value={value.rating} readOnly />
          </Box>
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
      <IconButton sx={{ p: 1 }} onClick={() => onDELETE(value.id)}>
        <DeleteOutline /> <Typography>Delete from Activities</Typography>
      </IconButton>
    </Box>
  );
}
