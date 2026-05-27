import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import { ChangeEvent, useEffect, useRef } from "react";

interface SearchBarProps {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
}

export default function SearchBar({
  searchQuery,
  handleSearchChange,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    handleSearchChange(e.target.value);
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "primary.light",
        borderRadius: 2,
        padding: "2px 8px",
        width: {
          xs: "100%",
          sm: "400px",
        },
        flexGrow: {
          xs: 1,
          sm: 0,
        },
      }}
    >
      <Box component="form" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton type="submit" aria-label="search">
            <Search />
          </IconButton>
          <InputBase
            placeholder="Search activities…"
            inputProps={{ "aria-label": "search activities" }}
            value={searchQuery}
            onChange={handleChange}
            inputRef={inputRef}
            sx={{ flexGrow: 1 }}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}
