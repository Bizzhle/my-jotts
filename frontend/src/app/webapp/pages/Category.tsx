import { ArrowRight } from "@mui/icons-material";
import { Box, Container, Divider, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutContext } from "../layout/LayoutContext";
import { useActivities } from "../utils/contexts/hooks/useActivities";

export default function Category() {
  const { categories } = useActivities();
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Categories
        </Typography>
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
