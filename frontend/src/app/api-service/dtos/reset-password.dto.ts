import { ResetPasswordData } from "../../authentication/ResetPassword";

export type ResetPasswordDataRequestDto = Omit<
  ResetPasswordData,
  "confirmPassword"
>;
