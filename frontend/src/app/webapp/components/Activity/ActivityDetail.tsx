import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Paper,
  Rating,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Link } from "react-router-dom";
import { useActivities } from "../../utils/contexts/ActivityContext";
import useS3Image from "../../utils/hooks/useS3Image";
import ActivityDialogForm from "./ActivityDialogForm";

export default function ActivityDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { activityData } = useActivities();
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = useS3Image(activityData?.imageUrls);

  function handleClose() {
    setActivityFormOpen(false);
  }

  if (!activityData) return null;

  return (
    <Container maxWidth="sm">
      {!isMobile && <Toolbar />}
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Activity
        </Typography>
      </Box>

      <Box mb={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Activities
          </Link>
          <Link
            to={`/categories/${activityData.categoryName}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {activityData.categoryName}
          </Link>
        </Breadcrumbs>
      </Box>
      {images.length > 0 && (
        <Box
          mb={2}
          position="relative"
          height={500}
          sx={{ overflow: "hidden" }}
        >
          <Box
            sx={{
              backgroundImage: `url(${images[currentImageIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(10px)", // Blur effect only for background
              opacity: 0.3,
              transform: "scale(1.1)", // Slightly zoom the background for effect
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1, // Ensure it's behind the main image
            }}
          />
          <Carousel
            index={currentImageIndex}
            onChange={(index: number | undefined) =>
              setCurrentImageIndex(index ?? 0)
            }
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  height: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={image}
                  alt={`Activity image ${index + 1}`}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))}
          </Carousel>
        </Box>
      )}
      <Paper variant="outlined" sx={{ maxWidth: 600, p: 2, mb: 2 }}>
        <Typography>{activityData?.activityTitle}</Typography>
        <Rating
          sx={{ mb: 1 }}
          name="rating"
          value={activityData.rating}
          readOnly
        />
        <Typography>{activityData?.price} euros</Typography>
        <Typography variant="body2">{activityData?.location}</Typography>
        <Typography variant="body2">
          {activityData?.dateCreated?.toString()}
        </Typography>
      </Paper>
      {activityData.description && (
        <Paper sx={{ p: 2, maxWidth: "600" }} variant="outlined">
          <Typography>{activityData?.description}</Typography>
        </Paper>
      )}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => setActivityFormOpen(true)}
      >
        Edit Activity
      </Button>
      <ActivityDialogForm
        open={activityFormOpen}
        handleClose={handleClose}
        activityToEdit={activityData}
      />
    </Container>
  );
}
