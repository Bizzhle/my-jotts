import { Autocomplete, TextField } from "@mui/material";

interface AutoCompleteProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: string[];
}

export default function AutoCompleteElement({
  value,
  setValue,
  label,
  options,
}: AutoCompleteProps) {
  return (
    <Autocomplete
      freeSolo
      disablePortal
      id="combo-box-demo"
      value={value}
      inputValue={value}
      onChange={(_, newValue) => {
        setValue(newValue || "");
      }}
      options={options}
      onInputChange={(_, newInputValue) => {
        setValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option === value || value === ""}
      renderInput={(params) => (
        <TextField
          margin="normal"
          {...params}
          fullWidth
          label={label}
          color="secondary"
        />
      )}
    />
  );
}
