import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ImageUrl } from "../../api-service/dtos/activity.dto";

interface ImageGalleryProps {
  images: ImageUrl[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImageUrl = images[selectedIndex]?.signedUrl;

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left" && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (direction === "right" && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <>
      <ImageList cols={2} gap={2} sx={{ mb: 2, width: "100%" }}>
        {images.map((img, idx) => (
          <ImageListItem
            key={idx}
            onClick={() => img.signedUrl && handleOpen(idx)}
            sx={{ cursor: img.signedUrl ? "pointer" : "default" }}
          >
            {img.signedUrl ? (
              <Box
                component="img"
                src={img.signedUrl}
                alt={`Activity image ${idx + 1}`}
                sx={{
                  width: "100%",
                  height: { xs: 180, sm: 200, md: 250 },
                  objectFit: "cover",
                }}
                loading="lazy"
              />
            ) : (
              <Box
                sx={{
                  height: { xs: 180, sm: 200, md: 250 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 1,
                  bgcolor: "action.hover",
                }}
              >
                {img.status.toUpperCase() === "FAILED" ? (
                  <Typography color="error" variant="body2">
                    Image processing failed
                  </Typography>
                ) : (
                  <>
                    <CircularProgress size={28} />
                    <Typography variant="body2" color="text.secondary">
                      Processing image...
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </ImageListItem>
        ))}
      </ImageList>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
          onClick={handleClose}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              color: "white",
              zIndex: 1400,
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          {selectedIndex > 0 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe("right");
              }}
              sx={{
                position: "absolute",
                left: 32,
                color: "white",
                zIndex: 1400,
                background: "rgba(0,0,0,0.3)",
                "&:hover": { background: "rgba(0,0,0,0.5)" },
              }}
              aria-label="Previous image"
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>
          )}
          {selectedImageUrl && (
            <img
              src={selectedImageUrl}
              alt={`Full view ${selectedIndex + 1}`}
              className="activity-image-large"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {selectedIndex < images.length - 1 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe("left");
              }}
              sx={{
                position: "absolute",
                right: 32,
                color: "white",
                zIndex: 1400,
                background: "rgba(0,0,0,0.3)",
                "&:hover": { background: "rgba(0,0,0,0.5)" },
              }}
              aria-label="Next image"
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Modal>
    </>
  );
}
