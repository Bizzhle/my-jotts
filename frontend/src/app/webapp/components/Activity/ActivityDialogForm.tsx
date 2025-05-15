import { HighlightOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiHandler, isApiError } from "../../../api-service/ApiRequestManager";
import { ActivityResponseDto } from "../../../api-service/dtos/activity.dto";
import { getErrorMessage } from "../../../libs/error-handling/gerErrorMessage";
import { useActivities } from "../../utils/contexts/hooks/useActivities";
import { useSubscription } from "../../utils/contexts/hooks/useSubscription";
import AutoCompleteElement from "../AutoCompleteElement";
import ActivityRating from "./ActivityRating";

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
  const { categories, reloadActivity, fetchActivity } = useActivities();
  const [value, setValue] = useState(activityToEdit?.categoryName || "");
  const [error, setError] = useState<string | undefined>("");
  const [files, setFiles] = useState<File[]>([]);
  const [rating, setRating] = useState<number>(activityToEdit?.rating || 0);
  const { handleSubmit, register, reset } = useForm<ActivityData>();
  const { subscription } = useSubscription();

  useEffect(() => {
    if (activityToEdit) {
      reset(activityToEdit);
    }
  }, [activityToEdit, reset]);

  const handleCloseDialog = () => {
    setError("");
    setFiles([]);
    setRating(0);
    setValue("");
    reset({
      activityTitle: "",
      categoryName: "",
      price: 0,
      location: "",
      description: "",
    });
    handleClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const totalFiles = files.length + selectedFiles.length;
      if (subscription?.status !== "active" && totalFiles > 1) {
        setError("You can only upload 1 image");
      } else if (subscription?.status === "active" && totalFiles > 5) {
        setError("You can only upload up to 5 images");
      }
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
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
        await ApiHandler.updateActivity(activityToEdit.id, activityData, files);
        await fetchActivity();
      } else {
        await ApiHandler.createActivity(activityData, files);
      }
      await reloadActivity();
      handleCloseDialog();
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage || "");
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth>
      <DialogTitle sx={{ mb: -2 }}>Add Activity</DialogTitle>
      <Box sx={{ mt: -2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && getErrorMessage(error)}
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
              <Button variant="outlined" component="span">
                {subscription?.status === "active"
                  ? "Upload Images"
                  : "Upload Image"}
              </Button>
            </label>
            {files.length > 0 && (
              <Box mt={1}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">{file.name}</Typography>
                    <IconButton onClick={() => handleRemoveFile(index)}>
                      <HighlightOff />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit">{activityToEdit ? "Update" : "Submit"}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
