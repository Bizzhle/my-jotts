export interface RegisterData {
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export type registrationData = Omit<RegisterData, "confirmPassword">;
