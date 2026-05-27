import {
  Box,
  Grid,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useActivities } from "../contexts/hooks/useActivities";
import ActivityDialogForm from "../features/activity/ActivityDialogForm";
import ActivityActions from "../features/activity/ActivityActions";
import { responseError } from "../features/category/CategoryDetail";
import CategoryForm from "../features/category/CategoryForm";
import { LayoutContext } from "../layout/LayoutContext";
import ActivityCard from "../ui/ActivityCard";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import { WithIntersectionObserver } from "../ui/InfiniteScroll";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState<boolean>(false);
  const { activities, loadActivities, deleteActivity, loading, searchQuery } = useActivities();
  const [error, setError] = useState<responseError>({});
  const { showSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setActivityFormOpen(false);
    setCategoryFormOpen(false);
  }

  const handleDeleteClick = async (activityId: number) => {
    setError({});
    try {
      await deleteActivity(activityId);
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

  useEffect(() => {
    showSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isMobile && <Toolbar />}
      <Box sx={{ mb: 4 }}>
        <ActivityActions
          setActivityFormOpen={setActivityFormOpen}
          setCategoryFormOpen={setCategoryFormOpen}
        />
      </Box>
      <WithIntersectionObserver>
        {loading ? (
          <LoadingState count={3} />
        ) : activities?.length > 0 ? (
          <Grid container spacing={{ xs: 2 }}>
            {activities.map((activity, index) => (
              <Grid item xs={12} key={index}>
                <ActivityCard
                  value={activity}
                  onDelete={handleDeleteClick}
                  error={error}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState
            title={
              searchQuery
                ? `No activities found for "${searchQuery}"`
                : "No activities yet"
            }
            subtitle={searchQuery ? undefined : "Add your first activity to get started."}
          />
        )}
        {activityFormOpen && (
          <ActivityDialogForm
            open={activityFormOpen}
            handleClose={handleClose}
          />
        )}
        {categoryFormOpen && (
          <CategoryForm open={categoryFormOpen} handleClose={handleClose} />
        )}
      </WithIntersectionObserver>
    </>
  );
}
