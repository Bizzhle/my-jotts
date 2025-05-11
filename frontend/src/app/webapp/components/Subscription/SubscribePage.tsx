import { Check } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { ApiHandler } from "../../../api-service/ApiRequestManager";
import { formatDateString } from "../../../libs/utils/Date";
import { LayoutContext } from "../../layout/LayoutContext";
import { useAuth } from "../../utils/contexts/hooks/useAuth";
import { useSubscription } from "../../utils/contexts/hooks/useSubscription";
import ProfileCards from "../AccountInfo/utils/ProfileCards";
import { CancelSubscription } from "./CancelSubscription";

export default function SubscribePage() {
  const { authenticatedUser } = useAuth();
  const { hideSearchBar } = useContext(LayoutContext);
  const { subscription, paymentPlans } = useSubscription();

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateSubscription = async (
    priceId: string,
    link: string,
    paymentPlanId: number
  ) => {
    try {
      await ApiHandler.createSubscription(priceId, paymentPlanId);

      const basePaymentLinkUrl = link;
      const successUrl = "http://localhost/5173/";
      const paymentLinkWithEmail = `${basePaymentLinkUrl}?prefilled_email=${encodeURIComponent(
        authenticatedUser?.emailAddress || ""
      )}&success_url=${encodeURIComponent(successUrl)}`;
      window.location.href = paymentLinkWithEmail;
    } catch (error) {
      console.log(error);
    }
  };

  if (!authenticatedUser) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Manage your Subscription
        </Typography>

        <ProfileCards title="Active plan">
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0, md: 3 },
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ ml: 2, mb: 2 }}>
              <Typography variant="body1">
                {subscription?.status === "active" ? "PRO" : "BASIC"}
              </Typography>
              <Typography variant="body1" sx={{ color: "#b0b0b5" }}>
                Jot every activity and experience.
              </Typography>
            </Box>

            {subscription?.status === "active" && (
              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body1" sx={{ color: "#b0b0b5" }}>
                  Monthly membership
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#b0b0b5" }}
                >{`auto renews on ${formatDateString(
                  subscription?.currentPeriodEnd
                )}`}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ ml: 2, mb: 2 }}>
            {subscription?.status === "active" && (
              <CancelSubscription
                subscriptionId={subscription?.stripeSubscriptionId}
              />
            )}
          </Box>
        </ProfileCards>

        <Toolbar />
        <ProfileCards title="All plans">
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, md: 3 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {paymentPlans &&
              paymentPlans.map((plan) => (
                <Container
                  key={plan.id}
                  sx={{
                    padding: 2,
                    width: { xs: "100%", md: 300 },
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography variant="body1" component="div">
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b0b0b5" }}>
                    `{plan.price}€ / month
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={
                      plan.name === "BASIC" || subscription?.status === "active"
                    }
                    onClick={() =>
                      handleCreateSubscription(
                        plan.stripePriceId,
                        plan.link,
                        plan.id
                      )
                    }
                  >
                    {plan.name === "BASIC" ? "Free" : "Subscribe"}
                  </Button>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography>{plan.description}</Typography>
                    {plan.features.map((feature, i) => {
                      return (
                        <List key={i}>
                          <ListItem
                            sx={{ display: "flex", gap: 2 }}
                            disablePadding
                          >
                            <Check fontSize="small" color="success" />
                            <Typography variant="body2">{feature}</Typography>
                          </ListItem>
                        </List>
                      );
                    })}
                  </Box>
                </Container>
              ))}
          </Box>
        </ProfileCards>
      </Box>
    </Container>
  );
}
