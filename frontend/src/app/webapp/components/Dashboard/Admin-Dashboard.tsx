import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import RoleForm from "./components/RoleForm";

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Dashboard
      </Typography>

      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Role Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RoleForm />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
