import { useActivities } from "../utils/contexts/ActivityContext";
import { Typography, Divider } from "@mui/material";
import {
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowRight } from "@mui/icons-material";

export default function Category() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { categories } = useActivities();

  return (
    <Container maxWidth="md">
      {!isMobile && <Toolbar />}
      <Box mb={2}>
        <Typography variant="h6">Categories</Typography>
      </Box>
      {categories.length === 0 ? (
        <Typography>No activities found for this category.</Typography>
      ) : (
        <Box>
          {categories.map((category) => (
            <Box key={category.id}>
              <Link
                to={`/categories/${category.categoryName}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography gutterBottom>{category.categoryName}</Typography>

                  <ArrowRight />
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Link>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
