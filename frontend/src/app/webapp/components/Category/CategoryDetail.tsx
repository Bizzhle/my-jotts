import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LayoutContext } from "../../layout/LayoutContext";
import { useActivities } from "../../utils/contexts/ActivityContext";
import ActivityCard from "../Card";

export default function CategoryDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { categoryName } = useParams<{ categoryName: string }>();
  const { activities } = useActivities();
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      {!isMobile && <Toolbar />}
      <Box mb={2}>
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
        <Typography>No activities found for this category.</Typography>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {activities.map((activity, index) => (
            <Grid item xs={12} sm={12} key={index}>
              <ActivityCard value={activity} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
