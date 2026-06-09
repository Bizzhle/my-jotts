import { ResetPasswordData } from "../../features/auth/ResetPassword";

export type ResetPasswordDataRequestDto = Omit<
  ResetPasswordData,
  "confirmPassword"
>;
