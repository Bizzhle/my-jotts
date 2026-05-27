import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useActivities } from "../../contexts/hooks/useActivities";
import { LayoutContext } from "../../layout/LayoutContext";
import ActivityDialogForm from "./ActivityDialogForm";
import ImageGallery from "./ImageGallery";

export default function ActivityDetail() {
  const { activityData, fetchActivity } = useActivities();
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const images = activityData?.imageUrls;
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setActivityFormOpen(false);
  }

  if (!activityData) return null;

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
    <Container maxWidth="sm">
      <Box sx={{ mb: 2, py: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Activities
          </Link>
          <Link
            to={`/categories/${activityData.categoryId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {activityData.categoryName}
          </Link>
        </Breadcrumbs>
      </Box>
      {images && images.length > 0 && <ImageGallery images={images} />}
      <Paper variant="outlined" sx={{ maxWidth: 600, p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>{activityData?.activityTitle}</Typography>
        <Rating
          sx={{ my: 1 }}
          name="rating"
          value={activityData.rating}
          readOnly
        />
        <Typography variant="h6">{activityData?.price} euros</Typography>
        <Typography variant="body1" color="text.secondary">{activityData?.location}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ my: 1, display: 'block' }}>
          {formatDate(activityData?.dateCreated)}
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
      {activityFormOpen && (
        <ActivityDialogForm
          open={activityFormOpen}
          handleClose={handleClose}
          activityToEdit={activityData}
        />
      )}
    </Container>
  );
}
