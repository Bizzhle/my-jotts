import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useActivities } from "../../contexts/hooks/useActivities";
import { LayoutContext } from "../../layout/LayoutContext";
import ActivityCard from "../../ui/ActivityCard";
import EmptyState from "../../ui/EmptyState";
import { WithIntersectionObserver } from "../../ui/InfiniteScroll";
import LoadingState from "../../ui/LoadingState";

export interface responseError {
  [key: number]: string | null | undefined;
}

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const { activities, category, loading, deleteActivity, loadActivitiesByCategory } =
    useActivities();
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
      await deleteActivity(activityId);
      if (categoryId) {
        await loadActivitiesByCategory(categoryId);
      }
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
        {loading ? (
          <LoadingState count={3} />
        ) : activities.length === 0 ? (
          <EmptyState
            title="No activities in this category"
            subtitle="Activities added to this category will appear here."
          />
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
