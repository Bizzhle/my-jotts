import { Star } from "@mui/icons-material";
import { Box, Rating } from "@mui/material";
import { useState } from "react";

interface ActivityRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const labels: { [index: string]: string } = {
  1: "Useless",

  2: "Poor",

  3: "Ok",

  4: "Good",

  5: "Excellent",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function ActivityRating({
  rating,
  setRating,
}: ActivityRatingProps) {
  const [hover, setHover] = useState(-1);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Rating
        name="hover-feedback"
        value={rating}
        precision={1}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setRating(newValue || 0);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {rating !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
      )}
    </Box>
  );
}
