import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  Modal,
} from "@mui/material";
import { useState } from "react";

interface ImageGalleryProps {
  images: { signedUrl: string }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
            onClick={() => handleOpen(idx)}
            sx={{ cursor: "pointer" }}
          >
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
          <img
            src={images[selectedIndex]?.signedUrl}
            alt={`Full view ${selectedIndex + 1}`}
            className="activity-image-large"
            onClick={(e) => e.stopPropagation()}
            // onTouchStart={(e) =>
            //   ((e.currentTarget as any).touchStartX = e.touches[0].clientX)
            // }
            // onTouchEnd={(e) => {
            //   const startX = (e.currentTarget as any).touchStartX;
            //   const endX = e.changedTouches[0].clientX;
            //   if (startX - endX > 50) handleSwipe("left");
            //   else if (endX - startX > 50) handleSwipe("right");
            // }}
          />
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
