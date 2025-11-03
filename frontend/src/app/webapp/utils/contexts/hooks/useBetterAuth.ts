import { useContext } from "react";
import { BetterAuthContext } from "../BetterAuthContext";

export const useBetterAuth = () => {
  const context = useContext(BetterAuthContext);
  if (context === undefined) {
    throw new Error("useBetterAuth must be used within an AuthProvider");
  }
  return context;
};
