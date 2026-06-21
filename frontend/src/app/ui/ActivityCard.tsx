import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ActivityResponseDto } from "../api-service/dtos/activity.dto";
import { ConfirmDeletionDialog } from "./ConfirmDeletionDialog";
import ErrorAlert from "./ErrorAlert";

interface CardProps {
  value: ActivityResponseDto;
  onDelete: (activityId: number) => void;
  error: Record<number, string | null | undefined>;
}

export default function ActivityCard({ value, onDelete, error }: CardProps) {
  const navigate = useNavigate();
  const imageUrl = value.imageUrls?.[0]?.signedUrl;
  const [open, setOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/activity/${value.id}`);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  };

  return (
    <Card
      sx={{
        border: "0.5px solid black",
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderBottom: "1px solid black",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            src={imageUrl}
            alt={value.activityTitle}
            sx={{
              maxWidth: { sm: 140 },
              height: 140,
              objectFit: "cover",
              typography: "body2",
            }}
          />
        )}

        <CardContent
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 2, md: 0, lg: 0 },
            }}
          >
            <Typography variant="body1"  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {value.activityTitle}
            </Typography>

            <Rating name="rating" value={value.rating} size="medium" readOnly />

            <Box onClick={(e) => e.stopPropagation()}>
              <Link
                to={`/categories/${value.subCategoryId ?? value.categoryId}`}
                style={{
                  color: "#0A82D8",
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {value.subCategoryName ? value.subCategoryName : value.categoryName}
              </Link>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", pl: 2, py: 0 }}
      >
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
          {formatDate(value?.dateCreated)}
        </Typography>{" "}
        <IconButton disableRipple onClick={() => setOpen(true)}>
          <DeleteOutline fontSize="small" />
        </IconButton>
        <ConfirmDeletionDialog
          open={open}
          setOpen={setOpen}
          value={value.id}
          onDelete={onDelete}
        />
      </CardActions>
      {error[value.id] && (
        <ErrorAlert message={error[value.id] as string} />
      )}
    </Card>
  );
}
