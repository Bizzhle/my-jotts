import { Button } from "@mui/material";
import { cancelSubscription } from "../../../api-service/services/subscription-services";

interface CancelSubscriptionProps {
  subscriptionId: string | undefined;
}
export const CancelSubscription = ({
  subscriptionId,
}: CancelSubscriptionProps) => {
  const handleCancelSubscription = async () => {
    if (!subscriptionId) return;
    await cancelSubscription(subscriptionId);
  };

  return (
    <Button onClick={handleCancelSubscription} variant="contained">
      Cancel Subscription
    </Button>
  );
};
