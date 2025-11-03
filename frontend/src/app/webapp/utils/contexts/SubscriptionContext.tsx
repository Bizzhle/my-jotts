import React, { createContext, useEffect, useState } from "react";
import { ApiHandler } from "../../../api-service/ApiRequestManager";
import { PaymentPlanDto } from "../../../api-service/dtos/subscription/payment-plan.dto";
import { SubscriptionDto } from "../../../api-service/dtos/subscription/subscription.dto";
import { authClient } from "../../../libs/betterAuthClient";
import { useBetterAuth } from "./hooks/useBetterAuth";

interface SubscriptionContextType {
  subscription?: SubscriptionDto;
  paymentPlans?: PaymentPlanDto[];
  loading: boolean;
  fetchSubscriptionStatus: () => Promise<void>;
}

interface SubscriptionProviderProps {
  children?: React.ReactNode;
}

export const SubscriptionContext = createContext<
  SubscriptionContextType | undefined
>(undefined);

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<SubscriptionDto>();
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlanDto[]>();
  const { authenticatedUser } = useBetterAuth();

  const [loading, setLoading] = useState<boolean>(true);

  const fetchSubscriptionStatus = async () => {
    setLoading(true);
    try {
      const { data: subscriptions } = await authClient.subscription.list();

      const activeSubscription = subscriptions?.find(
        (sub) => sub.status === "active" || sub.status === "trialing"
      );
      setSubscription(activeSubscription);
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    const plans = await ApiHandler.getPaymentPlans();
    setPaymentPlans(plans);
  };

  useEffect(() => {
    if (authenticatedUser) {
      fetchSubscriptionStatus();
      fetchPlans();
    }
  }, [authenticatedUser]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        fetchSubscriptionStatus,
        paymentPlans,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
