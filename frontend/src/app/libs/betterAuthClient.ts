import { stripeClient } from "@better-auth/stripe/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const API_URL = import.meta.env.VITE_API_URL;

export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
  credentials: "include",
  plugins: [
    adminClient(),
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
  ],
});

export const { useSession, verifyEmail } = authClient;
