import { Autocomplete, TextField } from "@mui/material";

interface AutoCompleteProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export default function AutoCompleteElement({
  value,
  setValue,
  label,
  options,
  onSelect,
  disabled,
}: AutoCompleteProps) {
  const uniqueOptions = Array.from(new Set(options.filter(Boolean)));
  return (
    <Autocomplete
      // freeSolo
      disabled={disabled}
      disablePortal
      id="combo-box-demo"
      value={value}
      // inputValue={value}
      onChange={(_, newValue) => {
        setValue(newValue || "");
        if (onSelect) {
          onSelect(newValue || "");
        }
      }}
      options={uniqueOptions}
      onInputChange={(_, newInputValue) => {
        setValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option === value || value === ""}
      getOptionLabel={(option) => (typeof option === "string" ? option : "")}
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
