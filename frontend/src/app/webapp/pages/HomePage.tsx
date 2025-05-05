import { Box, Grid, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ActivityDialogForm from "../components/Activity/ActivityDialogForm";
import ActivityCard from "../components/Card";
import CategoryForm from "../components/Category/CategoryForm";
import HomeBanner from "../components/HomeBanner";
import { LayoutContext } from "../layout/LayoutContext";
import { useActivities } from "../utils/contexts/ActivityContext";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activityFormOpen, setActivityFormOpen] = useState<boolean>(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState<boolean>(false);
  const { activities } = useActivities();
  const { showSearchBar } = useContext(LayoutContext);

  function handleClose() {
    setActivityFormOpen(false);
    setCategoryFormOpen(false);
  }

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
