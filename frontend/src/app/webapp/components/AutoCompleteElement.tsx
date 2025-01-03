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
      onChange={(event, newValue) => {
        setValue(newValue || "");
      }}
      options={options}
      onInputChange={(event, newInputValue) => {
        setValue(newInputValue);
      }}
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option === value || value === ""}
      renderInput={(params) => (
        <TextField {...params} label={label} color="secondary" />
      )}
    />
  );
}
