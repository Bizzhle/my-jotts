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
import CategoryForm from "../components/Category/CategoryForm";
import HomeBanner from "../components/HomeBanner";
import { LayoutContext } from "../layout/LayoutContext";
import { useActivities } from "../utils/contexts/hooks/useActivities";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState<boolean>(false);
  const { activities, reloadActivity, searchQuery } = useActivities();
  const { showSearchBar } = useContext(LayoutContext);

  function handleClose() {
    setActivityFormOpen(false);
    setCategoryFormOpen(false);
  }

  const handleDeleteClick = async (activityId: number) => {
    try {
      await ApiHandler.deleteActivity(activityId);
      await reloadActivity();
    } catch (error) {
      console.error("Error deleting activity:", error);
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
      <Grid container spacing={{ xs: 2 }}>
        {activities?.length > 0 ? (
          activities.map((activity, index) => (
            <Grid item xs={12} key={index}>
              <ActivityCard value={activity} onDELETE={handleDeleteClick} />
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
    </>
  );
}
