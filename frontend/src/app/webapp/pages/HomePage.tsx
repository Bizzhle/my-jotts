import {
  Box,
  Grid,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ApiHandler } from "../../api-service/ApiRequestManager";
import ActivityDialogForm from "../components/Activity/ActivityDialogForm";
import ActivityCard from "../components/Card";
import { responseError } from "../components/Category/CategoryDetail";
import CategoryForm from "../components/Category/CategoryForm";
import HomeBanner from "../components/HomeBanner";
import { WithIntersectionObserver } from "../components/InfiniteScroll";
import { LayoutContext } from "../layout/LayoutContext";
import { useActivities } from "../utils/contexts/hooks/useActivities";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState<boolean>(false);
  const { activities, reloadActivity, searchQuery } = useActivities();
  const [error, setError] = useState<responseError>({});
  const { showSearchBar } = useContext(LayoutContext);

  function handleClose() {
    setActivityFormOpen(false);
    setCategoryFormOpen(false);
  }

  const handleDeleteClick = async (activityId: number) => {
    setError({});
    try {
      await ApiHandler.deleteActivity(activityId);
      await reloadActivity();
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
        <HomeBanner
          setActivityFormOpen={setActivityFormOpen}
          setCategoryFormOpen={setCategoryFormOpen}
        />
      </Box>
      <WithIntersectionObserver>
        <Grid container spacing={{ xs: 2 }}>
          {activities?.length > 0 ? (
            activities.map((activity, index) => (
              <Grid item xs={12} key={index}>
                <ActivityCard
                  value={activity}
                  onDelete={handleDeleteClick}
                  error={error}
                />
              </Grid>
            ))
          ) : (
            <Typography>
              {searchQuery
                ? `There are no activities with this ${searchQuery}`
                : "There are no activities"}
            </Typography>
          )}
        </Grid>
        <ActivityDialogForm open={activityFormOpen} handleClose={handleClose} />
        <CategoryForm open={categoryFormOpen} handleClose={handleClose} />
      </WithIntersectionObserver>
    </>
  );
}
