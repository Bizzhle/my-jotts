import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiHandler } from "../../../api-service/ApiRequestManager";
import { LayoutContext } from "../../layout/LayoutContext";
import { useActivities } from "../../utils/contexts/hooks/useActivities";
import ActivityCard from "../Card";
import { WithIntersectionObserver } from "../InfiniteScroll";

export interface responseError {
  [key: number]: string | null | undefined;
}

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const {
    activities,
    loadActivities,
    category,

    loadActivitiesByCategory,
  } = useActivities();
  const { hideSearchBar } = useContext(LayoutContext);
  const [error, setError] = useState<responseError>({});

  useEffect(() => {
    hideSearchBar();
    if (categoryId) {
      loadActivitiesByCategory(categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClick = async (activityId: number) => {
    setError({});
    try {
      await ApiHandler.deleteActivity(activityId);
      await loadActivities(); // Reload category whenever the page is rendered
      setError((prevErrors) => ({
        ...prevErrors,
        [activityId]: null,
      }));
    } catch (error) {
      setError((prevErrors) => ({
        ...prevErrors,
        [activityId]: "Error deleting activity",
      }));
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, py: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Activities
          </Link>
          <Link
            to="/categories"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Categories
          </Link>
          <Typography variant="body1" color="secondary.main">
            {category?.categoryName}
          </Typography>
        </Breadcrumbs>
      </Box>
      <WithIntersectionObserver>
        {activities.length === 0 ? (
          <Box mb={2}>
            <Typography>No activities found for this category.</Typography>
          </Box>
        ) : (
          <Grid container sx={{ mb: 2 }} spacing={{ xs: 1, sm: 2, md: 2 }}>
            {activities.map((activity, index) => (
              <Grid item xs={12} sm={12} key={index}>
                <ActivityCard
                  value={activity}
                  onDelete={handleDeleteClick}
                  error={error}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </WithIntersectionObserver>
    </>
  );
}
