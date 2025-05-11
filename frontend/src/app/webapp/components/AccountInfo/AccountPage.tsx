import { Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutContext } from "../../layout/LayoutContext";
import { useAuth } from "../../utils/contexts/hooks/useAuth";
import ProfileCards from "./utils/ProfileCards";

export default function AccountPage() {
  const navigate = useNavigate();
  const { authenticatedUser } = useAuth();
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authenticatedUser) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Manage your account
        </Typography>

        <ProfileCards title="MyJotts">
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
            <Button onClick={() => navigate("/change-password")}>
              Change Password
            </Button>
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
