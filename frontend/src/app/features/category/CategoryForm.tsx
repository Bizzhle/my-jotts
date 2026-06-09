import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiHandler, isApiError } from "../../api-service/ApiRequestManager";
import {
  CategoryInfo,
  CategoryRequestData,
} from "../../api-service/dtos/category.dto";
import { useActivities } from "../../contexts/hooks/useActivities";
import ErrorAlert from "../../ui/ErrorAlert";

interface DialogFormProps {
  open: boolean;
  handleClose: () => void;
  categoryToEdit?: CategoryInfo;
}

export default function CategoryForm({
  open,
  handleClose,
  categoryToEdit,
}: DialogFormProps) {
  const [error, setError] = useState<string | undefined>("");
  const { fetchCategories } = useActivities();
  const { handleSubmit, register, reset } = useForm<CategoryRequestData>();

  function onClose() {
    reset();
    setError("");
    handleClose();
  }

  useEffect(() => {
    if (categoryToEdit) {
      reset(categoryToEdit);
    } else {
      reset({
        categoryName: "",
        description: "",
      });
    }
  }, [categoryToEdit, reset]);

  const onSubmit = async (data: CategoryRequestData) => {
    const { categoryName, description } = data;
  

    try {
      if (categoryToEdit) {
        await ApiHandler.updateCategory(categoryToEdit.id, {
          categoryName,
          description,
        });
      } else {
        await ApiHandler.createCategory({
          categoryName,
          description,
        });
      }
      await fetchCategories();
      onClose();
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ mb: -2 }}>Add Category</DialogTitle>
      <Box sx={{ mt: -2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <ErrorAlert message={error} onDismiss={() => setError("")} />

          <TextField
            autoFocus
            required
            id="category"
            label="Category"
            type="text"
            fullWidth
            margin="normal"
            {...register("categoryName")}
            color="secondary"
          />

          <TextField
            id="description"
            label="Description"
            type="text"
            fullWidth
            margin="normal"
            {...register("description")}
            color="secondary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
