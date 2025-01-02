import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ActivityRating from "./ActivityRating";
import AutoCompleteElement from "../AutoCompleteElement";
import { useForm } from "react-hook-form";
import {
  createActivity,
  updateActivity,
} from "../../../api-service/services/activity-service";
import { isApiError } from "../../../api-service/services/auth-service";
import { ActivityResponseDto } from "../../../api-service/dtos/activity.dto";
import { useActivities } from "../../utils/contexts/ActivityContext";

interface DialogFormProps {
  open: boolean;
  handleClose: () => void;
  activityToEdit?: ActivityResponseDto;
}

export interface ActivityData {
  activityTitle: string;
  categoryName: string;
  rating: number;
  price: number;
  location?: string;
  description?: string;
}

export default function ActivityDialogForm({
  open,
  handleClose,
  activityToEdit,
}: DialogFormProps) {
  const { categories, reloadActivity } = useActivities();
  const [value, setValue] = useState(activityToEdit?.categoryName || "");
  const [error, setError] = useState<string | undefined>("");
  const [files, setFiles] = useState<File[]>([]);
  const [rating, setRating] = useState<number>(activityToEdit?.rating || 0);
  const { handleSubmit, register, reset } = useForm<ActivityData>();

  useEffect(() => {
    if (activityToEdit) {
      reset({
        activityTitle: activityToEdit.activityTitle,
        categoryName: activityToEdit.categoryName,
        price: activityToEdit.price,
        location: activityToEdit.location,
        rating: activityToEdit.rating,
        description: activityToEdit.description,
      });
    } else {
      reset({
        activityTitle: "",
        categoryName: "",
        price: 0,
        location: "",
        rating: 0,
        description: "",
      });
    }
  }, [activityToEdit, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      if (selectedFiles.length > 5) {
        setError("You can only upload up to 5 images");
        return;
      }
      setFiles(selectedFiles);
    }
  };

  const onSubmit = async (data: ActivityData) => {
    const activityData = {
      ...data,
      categoryName: value,
      price: data.price !== undefined ? Number(data.price) : 0,
      rating: Number(rating),
    };

    try {
      if (activityToEdit) {
        await updateActivity(activityToEdit.id, activityData, files);
      } else {
        await createActivity(activityData, files);
      }
      reloadActivity();
      handleClose();
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage || "");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Activity</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && <Typography color="warning">{error}</Typography>}

          <TextField
            autoFocus
            required
            id="activity"
            label="Activity"
            type="text"
            fullWidth
            margin="normal"
            {...register("activityTitle")}
            color="secondary"
          />
          <AutoCompleteElement
            value={value}
            setValue={setValue}
            options={categories.map((category) => category.categoryName)}
            label="Category"
          />
          <TextField
            id="price"
            label="Price"
            type="text"
            fullWidth
            margin="normal"
            {...register("price")}
            color="secondary"
          />
          <TextField
            id="location"
            label="Location"
            type="text"
            fullWidth
            margin="normal"
            {...register("location")}
            color="secondary"
          />
          <ActivityRating rating={rating} setRating={setRating} />
          <TextField
            id="description"
            label="Description"
            type="text"
            fullWidth
            margin="normal"
            {...register("description")}
            color="secondary"
          />
          <Box mt={2}>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span">
                Upload Images (Max 5)
              </Button>
            </label>
            {files.length > 0 && (
              <Typography variant="body2" mt={1}>
                {files.length} file(s) selected
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">{activityToEdit ? "Update" : "Submit"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
