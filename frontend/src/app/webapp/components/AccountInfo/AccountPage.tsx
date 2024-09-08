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
          <Typography variant="h4">
            {authenticatedUser?.firstName} {authenticatedUser.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {authenticatedUser.emailAddress}
          </Typography>
          <Box
            sx={{ mt: 2 }}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="body1" paragraph>
              password: **********
            </Typography>
            <Button>Change Password</Button>
          </Box>
        </ProfileCards>
        <Toolbar />
        <ProfileCards title="My Subscriptions">
          <Box>
            <Typography variant="h6" gutterBottom>
              Your subscriptions and billing
            </Typography>
            <Box mt={2}>
              <Typography variant="body1" component="div">
                Subscriptions
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b5" }}>
                Disney+ Standard ( monthly subscription )
              </Typography>
              <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                Manage your subscription settings in your iTunes account.
              </Typography>
            </Box>
          </Box>

          <Button variant="contained" sx={{ mt: 2 }}>
            Cancel Subscription
          </Button>
        </ProfileCards>
        <Toolbar />

        <ProfileCards title="Additional settings">
          <Typography variant="h6" gutterBottom>
            Deactivate account
          </Typography>
        </ProfileCards>
      </Box>
    </Container>
  );
}
