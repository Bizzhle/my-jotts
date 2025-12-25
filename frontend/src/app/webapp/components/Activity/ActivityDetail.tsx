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
import { LayoutContext } from "../../layout/LayoutContext";
import { useActivities } from "../../utils/contexts/hooks/useActivities";
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 2, py: 2 }}>
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
      {images && images.length > 0 && <ImageGallery images={images} />}
      <Paper variant="outlined" sx={{ maxWidth: 600, p: 2, mb: 2 }}>
        <Typography>{activityData?.activityTitle}</Typography>
        <Rating
          sx={{ my: 1 }}
          name="rating"
          value={activityData.rating}
          readOnly
        />
        <Typography>{activityData?.price} euros</Typography>
        <Typography variant="body2">{activityData?.location}</Typography>
        <Typography sx={{ my: 1, fontSize: "0.8rem", color: "text.secondary" }}>
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
