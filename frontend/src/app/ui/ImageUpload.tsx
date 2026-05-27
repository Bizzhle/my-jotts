import { HighlightOff } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React from "react";
import { ImageUrl } from "../api-service/dtos/activity.dto";
import { handleFileCompression } from "../utils/compressImage";


interface ImageUploadProps {
  existingImages: ImageUrl[];
  onRemoveExisting: (imageUrl: ImageUrl) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  subscription?: { status: string };
  onError?: (error: string) => void;
}

export default function ImageUpload({
  existingImages,
  onRemoveExisting,
  files,
  onFilesChange,
  onRemoveNew,
  subscription,
  onError,
}: ImageUploadProps) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      const remainingExistingImages = existingImages.length;
      const totalFiles =
        files.length + selectedFiles.length + remainingExistingImages;

      if (subscription?.status !== "active" && totalFiles > 2) {
        onError?.("You can only upload 1 image");
        return;
      } else if (subscription?.status === "active" && totalFiles > 5) {
        onError?.("You can only upload up to 5 images");
        return;
      }

      const compressedFiles = await Promise.all(
        selectedFiles.map((element) => handleFileCompression(element)),
      );

      onFilesChange([
        ...files,
        ...compressedFiles.filter((file): file is File => !!file),
      ]);
    }
  };

  return (
    <Box mt={2}>
      <input
        accept="image/*"
        id="image-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        hidden
      />
      <label htmlFor="image-upload">
        <Button variant="outlined" component="span" fullWidth>
          {subscription?.status === "active" ? "Upload Images" : "Upload Image"}
        </Button>
      </label>

      {existingImages.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Existing Images
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {existingImages.map((imageUrl, index) => (
              <Box
                key={imageUrl.signedUrl}
                position="relative"
                width={100}
                height={100}
              >
                <img
                  src={imageUrl.signedUrl}
                  alt={`Activity image ${index + 1}`}
                  className="activity-form-image"
                />
                <IconButton
                  onClick={() => onRemoveExisting(imageUrl)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    boxShadow: 1,
                  }}
                  size="small"
                >
                  <HighlightOff fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

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
              <IconButton onClick={() => onRemoveNew(index)}>
                <HighlightOff />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
