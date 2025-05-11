import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LayoutContext } from "../../layout/LayoutContext";
import { useActivities } from "../../utils/contexts/hooks/useActivities";
import ActivityCard from "../Card";

export default function CategoryDetail() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { activities } = useActivities();
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {categoryName}
          </Typography>
        </Breadcrumbs>
      </Box>

      {activities.length === 0 ? (
        <Box mb={2}>
          <Typography>No activities found for this category.</Typography>
        </Box>
      ) : (
        <Grid container sx={{ mb: 2 }} spacing={{ xs: 1, sm: 2, md: 2 }}>
          {activities.map((activity, index) => (
            <Grid item xs={12} sm={12} key={index}>
              <ActivityCard value={activity} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
