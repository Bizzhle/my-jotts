import { ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { theme } from "./app/styles/theme.tsx";
import { BetterAuthProvider } from "./app/webapp/utils/contexts/BetterAuthContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BetterAuthProvider>
        <App />
      </BetterAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
