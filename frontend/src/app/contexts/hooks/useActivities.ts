import { useContext } from "react";
import { ActivityContext } from "../ActivityContext";

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
}
