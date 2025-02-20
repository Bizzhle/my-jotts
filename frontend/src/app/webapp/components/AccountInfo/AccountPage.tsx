import { useAuth } from "../../utils/contexts/AuthContext";
import {
  Container,
  Typography,
  Button,
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ProfileCards from "./utils/ProfileCards";
import { Link } from "react-router-dom";

export default function AccountPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { authenticatedUser } = useAuth();

  if (!authenticatedUser) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      {!isMobile && <Toolbar />}

      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Manage your account
        </Typography>

        <ProfileCards title="Jotta">
          <Typography variant="body1" gutterBottom>
            {authenticatedUser?.firstName} {authenticatedUser.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {authenticatedUser.emailAddress}
          </Typography>
          <Typography variant="body1" gutterBottom>
            password: **********
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button>Change Password</Button>
          </Box>
        </ProfileCards>
        <Toolbar />

        <ProfileCards title="Additional settings">
          <Box sx={{ mb: 2 }}>
            <Link to="" style={{ textDecoration: "none", color: "red" }}>
              <Typography>Deactivate account</Typography>
            </Link>
          </Box>

          <Link to="" style={{ textDecoration: "none", color: "red" }}>
            <Typography>Delete account</Typography>
          </Link>
        </ProfileCards>
      </Box>
    </Container>
  );
}
