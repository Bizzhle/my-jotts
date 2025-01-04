import {
  Box,
  Button,
  Container,
  Divider,
  List,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  ListItem,
} from "@mui/material";
import { useAuth } from "../../utils/contexts/AuthContext";
import ProfileCards from "../AccountInfo/utils/ProfileCards";
import { useEffect, useState } from "react";
import { PaymentPlanDto } from "../../../api-service/dtos/subscription/payment-plan.dto";
import {
  createSubscription,
  getSubscription,
  getPaymentPlans,
} from "../../../api-service/services/subscription-services";
import { Check } from "@mui/icons-material";
import { SubscriptionDto } from "../../../api-service/dtos/subscription/subscription.dto";
import { CancelSubscription } from "./CancelSubscription";
import { formatDateString } from "../../../libs/utils/Date";

export default function SubscribePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { authenticatedUser } = useAuth();
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlanDto[]>();
  const [subscription, setSubscription] = useState<SubscriptionDto>();

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  const fetchPlans = async () => {
    const plans = await getPaymentPlans();
    setPaymentPlans(plans);
  };

  const fetchSubscription = async () => {
    try {
      const subscription = await getSubscription();
      setSubscription(subscription);
    } catch (error) {
      console.error("Error fetching subscription", error);
    }
  };

  const handleCreateSubscription = async (
    priceId: string,
    link: string,
    paymentPlanId: number
  ) => {
    try {
      await createSubscription(priceId, paymentPlanId);

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
      {!isMobile && <Toolbar />}

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
