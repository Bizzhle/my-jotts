import { useState } from "react";
import HomeBanner from "../components/HomeBanner";
import { Box, Grid, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import ActivityCard from "../components/Card";
import ActivityDialogForm from "../components/Activity/ActivityDialogForm";
import CategoryForm from "../components/Category/CategoryForm";
import { useActivities } from "../utils/contexts/ActivityContext";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState<boolean>(false);
  const { activities } = useActivities();

  function handleClose() {
    setActivityFormOpen(false);
    setCategoryFormOpen(false);
  }

  return (
    <>
      {!isMobile && <Toolbar />}
      <Box sx={{ mb: 4 }}>
        <HomeBanner
          setActivityFormOpen={setActivityFormOpen}
          setCategoryFormOpen={setCategoryFormOpen}
        />
      </Box>
      <Grid container spacing={{ xs: 1, sm: 2, md: 2 }}>
        {activities.map((activity, index) => (
          <Grid item xs={12} key={index}>
            <ActivityCard value={activity} />
          </Grid>
        ))}
      </Grid>
      <ActivityDialogForm open={activityFormOpen} handleClose={handleClose} />
      <CategoryForm open={categoryFormOpen} handleClose={handleClose} />
    </>
  );
}
