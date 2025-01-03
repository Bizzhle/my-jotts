import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AutoCompleteElement from "../AutoCompleteElement";
import { createCategory } from "../../../api-service/services/category-services";
import { isApiError } from "../../../api-service/services/auth-service";
import { useActivities } from "../../utils/contexts/ActivityContext";

interface DialogFormProps {
  open: boolean;
  handleClose: () => void;
}

export interface CategoryData {
  id: number;
  categoryName: string;
  description?: string;
}

export default function CategoryForm({ open, handleClose }: DialogFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { reloadCategory } = useActivities();

  const {
    handleSubmit,
    register,
    reset,
    // formState: { errors },
  } = useForm<CategoryData>();

  function onClose() {
    reset();
    setValue("");
    setError("");
    handleClose();
  }

  const onSubmit = async (data: CategoryData) => {
    const categoryData = {
      ...data,
      categoryName: value,
    };
    try {
      await createCategory(categoryData);
      await reloadCategory();
      onClose();
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Category</DialogTitle>
      {error && (
        <Typography color="error" sx={{ ml: 3 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <AutoCompleteElement
            value={value}
            setValue={setValue}
            label="Category"
            options={[]}
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
      </form>
    </Dialog>
  );
}
