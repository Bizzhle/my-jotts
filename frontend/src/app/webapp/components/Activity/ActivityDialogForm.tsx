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
import {
  ActivityResponseDto,
  ImageUrl,
} from "../../../api-service/dtos/activity.dto";
import { getErrorMessage } from "../../../libs/error-handling/gerErrorMessage";
import { useActivities } from "../../utils/contexts/hooks/useActivities";
import { useSubscription } from "../../utils/contexts/hooks/useSubscription";
import { handleFileCompression } from "../../utils/shared/compressImage";
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
  const { categories, reloadActivity, fetchActivity, reloadCategories } =
    useActivities();
  const [value, setValue] = useState(activityToEdit?.categoryName || "");
  const [error, setError] = useState<string | undefined>("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageUrl[]>(
    activityToEdit?.imageUrls?.map((img) => img) || []
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(activityToEdit?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, register, reset } = useForm<ActivityData>();
  const { subscription } = useSubscription();

  useEffect(() => {
    if (activityToEdit) {
      // Only reset with allowed fields
      const {
        activityTitle,
        categoryName,
        rating,
        price,
        location,
        description,
        imageUrls,
      } = activityToEdit;
      reset({
        activityTitle,
        categoryName,
        rating,
        price,
        location,
        description,
      });
      setExistingImages(imageUrls?.map((img) => img) || []);
      setImagesToDelete([]);
    }
  }, [activityToEdit, reset]);

  const handleCloseDialog = () => {
    setError("");
    setFiles([]);
    setExistingImages([]);
    setImagesToDelete([]);
    setRating(0);
    setValue("");
    reset({
      activityTitle: "",
      categoryName: "",
      rating: 0,
      price: 0,
      location: "",
      description: "",
    });
    handleClose();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      const remainingExistingImages =
        existingImages.length - imagesToDelete.length;
      const totalFiles =
        files.length + selectedFiles.length + remainingExistingImages;
      if (subscription?.status !== "active" && totalFiles > 2) {
        setError("You can only upload 1 image");
        return;
      } else if (subscription?.status === "active" && totalFiles > 5) {
        setError("You can only upload up to 5 images");
        return;
      }
      const compressedFiles = await Promise.all(
        selectedFiles.map((element) => handleFileCompression(element))
      );

      setFiles((prevFiles) => [
        ...prevFiles,
        ...compressedFiles.filter((file): file is File => !!file),
      ]);
    }
  };

  const onSubmit = async (data: ActivityData) => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setError(""); // Clear previous errors

    const { activityTitle, price, location, description } = data;
    const activityData = {
      activityTitle,
      categoryName: value,
      price: price !== undefined ? Number(price) : 0,
      rating: Number(rating),
      location,
      description,
    };

    try {
      if (activityToEdit) {
        await ApiHandler.updateActivity(
          activityToEdit.id,
          activityData,
          files,
          imagesToDelete
        );
        await fetchActivity();
      } else {
        await ApiHandler.createActivity(activityData, files);
      }
      await reloadActivity();
      await reloadCategories();
      handleCloseDialog();
    } catch (err) {
      const errorMessage = isApiError(err);
      setError(errorMessage || "");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl: ImageUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
    setImagesToDelete((prev) => [...prev, imageUrl.rawUrl]);
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth>
      <DialogTitle sx={{ mb: -2 }}>
        {activityToEdit ? "Edit Activity" : "Add Activity"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            {/* Existing Images Section */}
            {activityToEdit && existingImages.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Existing Images
                </Typography>
                {existingImages.map((imageUrl, index) => (
                  <Box
                    key={imageUrl.signedUrl}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="body2">
                      Image {index + 1} (
                      {imageUrl.signedUrl.split("/").pop()?.substring(0, 20)}
                      ...)
                    </Typography>
                    <IconButton
                      onClick={() => handleRemoveExistingImage(imageUrl)}
                    >
                      <HighlightOff />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* New Images Upload Section */}
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              multiple
              onChange={handleFileChange}
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
          <Button
            type="button"
            onClick={handleCloseDialog}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : activityToEdit
              ? "Update"
              : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
