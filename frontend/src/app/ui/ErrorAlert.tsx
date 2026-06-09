import { Alert, AlertProps, Collapse } from "@mui/material";
import { Link } from "react-router-dom";

interface ErrorAlertProps {
  message?: string | null;
  onDismiss?: () => void;
  severity?: AlertProps["severity"];
}

const LIMIT_MESSAGES: Record<string, React.ReactNode> = {
  "Maximum activities": (
    <>
      You have reached the maximum allowed activities.{" "}
      <Link to="/subscription">Subscribe</Link> to add more.
    </>
  ),
  "Maximum categories": (
    <>
      You have reached the maximum allowed categories.{" "}
      <Link to="/subscription">Subscribe</Link> to add more.
    </>
  ),
  "Maximum images": (
    <>
      You are only allowed 1 image upload.{" "}
      <Link to="/subscription">Subscribe</Link> to upload more.
    </>
  ),
};

export default function ErrorAlert({
  message,
  onDismiss,
  severity,
}: ErrorAlertProps) {
  if (!message) return null;

  const limitContent = LIMIT_MESSAGES[message];
  const resolvedSeverity = severity ?? (limitContent ? "warning" : "error");
  const content = limitContent ?? `${message} Please try again.`;

  return (
    <Collapse in={!!message}>
      <Alert severity={resolvedSeverity} onClose={onDismiss} sx={{ mb: 1 }}>
        {content}
      </Alert>
    </Collapse>
  );
}
