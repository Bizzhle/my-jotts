export interface RegisterData {
  email: string;
  name?: string;
  password: string;
  confirmPassword: string;
}

export type registrationData = Omit<RegisterData, "confirmPassword">;
