import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiHandler, isApiError } from "../../api-service/ApiRequestManager";
import {
  ActivityResponseDto,
  ImageUrl,
} from "../../api-service/dtos/activity.dto";
import { SubCategoryData } from "../../api-service/dtos/category.dto";
import { useActivities } from "../../contexts/hooks/useActivities";
import { useSubscription } from "../../contexts/hooks/useSubscription";
import AutoCompleteElement from "../../ui/AutoCompleteElement";
import ErrorAlert from "../../ui/ErrorAlert";
import ImageUpload from "../../ui/ImageUpload";
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
  subCategoryName?: string;
}

export default function ActivityDialogForm({
  open,
  handleClose,
  activityToEdit,
}: DialogFormProps) {
  const { categories, loadActivities, fetchActivity, fetchCategories } =
    useActivities();
  const [value, setValue] = useState(
    activityToEdit?.categoryName || "",
  );

  const [subCategory, setSubCategory] = useState(
    activityToEdit?.subCategoryName ? activityToEdit?.subCategoryName : "",
  );
  const [error, setError] = useState<string | undefined>("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageUrl[]>(
    activityToEdit?.imageUrls?.map((img) => img) || [],
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(activityToEdit?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategoryData[]>([]);
  const { handleSubmit, register, reset } = useForm<ActivityData>();
  const { subscription } = useSubscription();

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activityToEdit) {
      // Only reset with allowed fields
      const {
        activityTitle,
        categoryName,
        subCategoryName,
        rating,
        price,
        location,
        description,
        imageUrls,
      } = activityToEdit;
      reset({
        activityTitle,
        categoryName,
        subCategoryName,
        rating,
        price,
        location,
        description,
      });
      setExistingImages(imageUrls?.map((img) => img) || []);
      setImagesToDelete([]);
    }
  }, [activityToEdit, reset]);

  useEffect(() => {
    // Fetch sub-categories if editing an activity with a parent category
    const fetchInitialSubCategories = async () => {
      if (activityToEdit && value) {
      
        const selectedCategory = categories.find(
          (cat) => cat.categoryName === value,
        );
        if (selectedCategory) {
          await fetchSubCategories(selectedCategory.id);
        }
      }
    };

    fetchInitialSubCategories();
  }, [activityToEdit, categories, value]);

  const fetchSubCategories = async (parentCategoryId: number) => {
    try {
      const subCategoriesData =
        await ApiHandler.getSubCategoriesByParentId(parentCategoryId);
      setSubCategories(subCategoriesData);
    } catch (err) {
      setError("Could not fetch sub categories");
      return;
    }
  };

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

  const onSubmit = async (data: ActivityData) => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setError(""); // Clear previous errors

    const { activityTitle, price, location, description } = data;
    const activityData = {
      activityTitle,
      categoryName: value,
      subCategoryName: subCategory,
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
          imagesToDelete,
        );
        await fetchActivity();
      } else {
        await ApiHandler.createActivity(activityData, files);
      }
      await loadActivities();
      await fetchCategories();
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

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth>
      <DialogTitle sx={{ mb: -2 }}>
        {activityToEdit ? "Edit Activity" : "Add Activity"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <ErrorAlert message={error} onDismiss={() => setError("")} />
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
            onSelect={async (selectedCategoryName: string) => {
              setValue(selectedCategoryName);
              const selectedCategory = categories.find(
                (cat) => cat.categoryName === selectedCategoryName,
              );
              if (selectedCategory) {
                await fetchSubCategories(selectedCategory.id);
              } else {
                setSubCategories([]);
              }
            }}
          />
          <AutoCompleteElement
            value={subCategory}
            setValue={setSubCategory}
            options={subCategories.map(
              (subCategory) => subCategory.categoryName,
            )}
            label="Sub category"
            disabled={!value}
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
          <ImageUpload
            existingImages={existingImages}
            onRemoveExisting={handleRemoveExistingImage}
            files={files}
            onFilesChange={handleFilesChange}
            onRemoveNew={handleRemoveFile}
            subscription={subscription}
            onError={setError}
          />
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
