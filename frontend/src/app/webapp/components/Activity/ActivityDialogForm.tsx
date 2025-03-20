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
import { getErrorMessage } from "../../../libs/error-handling/gerErrorMessage";
import { getSubscription } from "../../../api-service/services/subscription-services";
import { SubscriptionDto } from "../../../api-service/dtos/subscription/subscription.dto";

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
  const [subscription, setSubscription] = useState<SubscriptionDto>();

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
    fetchSubscription();
  }, [activityToEdit, reset]);

  const fetchSubscription = async () => {
    try {
      const subscription = await getSubscription();
      setSubscription(subscription);
    } catch (error) {
      console.error("Error fetching subscription", error);
    }
  };

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
        await fetchActivity();
      } else {
        await createActivity(activityData, files);
      }
      await reloadActivity();
      handleClose();
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage || "");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
                  ? "Upload Images (Max 3)"
                  : "Upload Images (Max 1)"}
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
      </Box>
    </Dialog>
  );
}
