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
import { ApiHandler, isApiError } from "../../../api-service/ApiRequestManager";
import { CategoryData } from "../../../api-service/dtos/category.dto";
import { getErrorMessage } from "../../../libs/error-handling/gerErrorMessage";
import { useActivities } from "../../utils/contexts/hooks/useActivities";

interface DialogFormProps {
  open: boolean;
  handleClose: () => void;
  categoryToEdit?: CategoryData;
}

export default function CategoryForm({
  open,
  handleClose,
  categoryToEdit,
}: DialogFormProps) {
  const [error, setError] = useState<string | undefined>("");
  const { reloadCategories } = useActivities();
  const { handleSubmit, register, reset } = useForm<CategoryData>();

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

  const onSubmit = async (data: CategoryData) => {
    const categoryData = {
      ...data,
    };

    try {
      if (categoryToEdit) {
        await ApiHandler.updateCategory(categoryToEdit.id, categoryData);
      } else {
        await ApiHandler.createCategory(categoryData);
      }
      await reloadCategories();
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
          {error && getErrorMessage(error)}

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
