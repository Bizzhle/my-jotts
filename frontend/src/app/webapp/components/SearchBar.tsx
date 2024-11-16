import { InputBase, IconButton, Paper } from "@mui/material";
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
    <form>
      <Paper>
        <IconButton>
          <Search />
        </IconButton>
        <InputBase
          placeholder="Search activities…"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={handleChange}
        />
      </Paper>
    </form>
  );
}
