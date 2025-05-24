import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface ConfirmDeletionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: number;
  onDelete: (id: number) => void;
  section?: string;
}

export const ConfirmDeletionDialog = ({
  open,
  setOpen,
  value,
  onDelete,
  section = "activity",
}: ConfirmDeletionDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this {section}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            onDelete(value);
          }}
          color="error"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
