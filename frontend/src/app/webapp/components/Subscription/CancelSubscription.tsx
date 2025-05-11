import { Button } from "@mui/material";
import { ApiHandler } from "../../../api-service/ApiRequestManager";

interface CancelSubscriptionProps {
  subscriptionId: string | undefined;
}
export const CancelSubscription = ({
  subscriptionId,
}: CancelSubscriptionProps) => {
  const handleCancelSubscription = async () => {
    if (!subscriptionId) return;
    await ApiHandler.cancelSubscription(subscriptionId);
  };

  return (
    <Button fullWidth onClick={handleCancelSubscription} variant="contained">
      Cancel Subscription
    </Button>
  );
};
