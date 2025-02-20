import apiClient from "../../libs/Configs/axiosConfig";
import { PaymentPlanDto } from "../dtos/subscription/payment-plan.dto";
import {
  SubscriptionDto,
  SubscriptionResponseDto,
} from "../dtos/subscription/subscription.dto";

export async function createSubscription(
  priceId: string,
  paymentPlanId: number
): Promise<SubscriptionResponseDto> {
  const response = await apiClient.post(`/subscription`, {
    priceId,
    paymentPlanId,
  });
  return response.data as SubscriptionResponseDto;
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<void> {
  return await apiClient.delete(`/subscription/${subscriptionId}`);
}

export async function getSubscription(): Promise<SubscriptionDto> {
  const response = await apiClient.get(`/subscription`);
  return response.data;
}

export async function getPaymentPlans(): Promise<PaymentPlanDto[]> {
  const response = await apiClient.get(`/payment-plan`);
  return response.data;
}
