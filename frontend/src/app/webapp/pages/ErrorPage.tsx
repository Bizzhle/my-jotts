import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") {
      return error;
    } else if (error instanceof Error) {
      return error.message;
    } else if (error && typeof error === "object" && "statusText" in error) {
      return (error as { statusText?: string }).statusText || "Unknown error";
    } else {
      return "Unknown error";
    }
  };

  return (
    <div id="error-page">
      <h1>Ooops!</h1>
      <p>Sorry, an unexpected error has occured</p>
      <p>
        <i>{getErrorMessage(error)}</i>
      </p>
    </div>
  );
}
