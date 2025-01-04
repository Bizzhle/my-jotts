import { InputBase, Box } from "@mui/material";
import { ChangeEvent } from "react";
import { Search } from "@mui/icons-material";

interface SearchBarProps {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
}

export default function SearchBar({
  searchQuery,
  handleSearchChange,
}: SearchBarProps) {
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
      <form>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search />
          <InputBase
            placeholder="Search activities…"
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
        </Box>
      </form>
    </Box>
  );
}
