import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiHandler, isApiError } from "../../api-service/ApiRequestManager";
import { CategoryData } from "../../api-service/dtos/category.dto";
import CategoryForm from "../components/Category/CategoryForm";
import { LayoutContext } from "../layout/LayoutContext";
import { useActivities } from "../utils/contexts/hooks/useActivities";
import { ConfirmDeletionDialog } from "../utils/Dialog/confirmDeletion";

export default function Category() {
  const { categories, fetchCategories } = useActivities();
  const { hideSearchBar } = useContext(LayoutContext);
  const [openCategoryForm, setOpenCategoryForm] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<
    Record<number, string | null | undefined>
  >({});

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setOpenCategoryForm(false);
    setSelectedCategory(null);
  }

  const handleDeleteCategory = async (categoryId: number) => {
    setErrors({});
    try {
      await ApiHandler.deleteCategory(categoryId);
      await fetchCategories();
      setErrors((prevErrors) => ({
        ...prevErrors,
        [categoryId]: null,
      }));
    } catch (error) {
      const errorMessage = isApiError(error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [categoryId]: errorMessage,
      }));
    }
  };

  const handleEditCategory = (category: CategoryData) => {
    setSelectedCategory(category);
    setOpenCategoryForm(true);
  };

  return (
    <>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid black",
                  borderRadius: 1,
                  padding: 1,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Link
                    to={`/categories/${category.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography gutterBottom>
                      {category.categoryName}
                    </Typography>
                  </Link>
                </Box>
                <IconButton
                  aria-label="edit category"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="delete category"
                  onClick={() => setOpen(true)}
                >
                  <Delete />
                </IconButton>
                <ConfirmDeletionDialog
                  open={open}
                  setOpen={setOpen}
                  value={category.id}
                  onDelete={handleDeleteCategory}
                  section="category"
                />
              </Box>
              {errors[category.id] && (
                <Typography variant="body2" color="error.main">
                  {errors[category.id]}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
      {selectedCategory && (
        <CategoryForm
          open={openCategoryForm}
          handleClose={handleClose}
          categoryToEdit={selectedCategory}
        />
      )}
    </>
  );
}
