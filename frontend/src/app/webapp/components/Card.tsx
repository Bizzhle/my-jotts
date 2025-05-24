import { DeleteOutline } from "@mui/icons-material";
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ActivitiesResponseDto } from "../../api-service/dtos/activity.dto";
import { ConfirmDeletionDialog } from "../utils/Dialog/confirmDeletion";

interface CardProps {
  value: ActivitiesResponseDto;
  onDelete: (activityId: number) => void;
  error: Record<number, string | null | undefined>;
}

export default function ActivityCard({ value, onDelete, error }: CardProps) {
  const navigate = useNavigate();
  const imageUrl = value.imageUrls;
  const [open, setOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/activity/${value.id}`);
  };

  return (
    <>
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
          {imageUrl && (
            <CardMedia
              component="img"
              image={imageUrl}
              src={imageUrl}
              alt={value.activityTitle}
              sx={{
                maxWidth: 140,
                height: 140,
                objectFit: "fit",
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
        <Box
          onClick={() => setOpen(true)}
          sx={{
            ":hover": { backgroundColor: "#f5f5f5" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton disableRipple>
            <DeleteOutline />
          </IconButton>
          <Typography>Delete from Activities</Typography>
          <ConfirmDeletionDialog
            open={open}
            setOpen={setOpen}
            value={value.id}
            onDelete={onDelete}
          />
        </Box>
      </Box>
      {error[value.id] && (
        <Typography variant="body2" color="error.main">
          {error[value.id]}
        </Typography>
      )}
    </>
  );
}
