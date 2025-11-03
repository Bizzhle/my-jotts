import { Button } from "@mui/material";
import { authClient } from "../../../libs/betterAuthClient";

interface CancelSubscriptionProps {
  subscriptionId: string | undefined;
}
const returnUrl = import.meta.env.VITE_FRONTEND_URL + "/subscription";
export const CancelSubscription = ({
  subscriptionId,
}: CancelSubscriptionProps) => {
  const handleCancelSubscription = async () => {
    if (!subscriptionId) return;
    await authClient.subscription.cancel({
      subscriptionId,
      returnUrl,
    });
  };

  return (
    <Button fullWidth onClick={handleCancelSubscription} variant="contained">
      Cancel Subscription
    </Button>
  );
};
