import { createTheme } from "@mui/material";
import { tokens } from "./tokens";

export const theme = createTheme({
  palette: {
    primary: {
      main: tokens.color.white,
      light: tokens.color.gray100,
      dark: tokens.color.gray200,
    },
    secondary: {
      main: tokens.color.black,
      light: tokens.color.gray500,
      dark: tokens.color.brand, // The actual action/brand color
    },
    info: {
      main: tokens.color.brand,
      dark: tokens.color.brandDark,
      light: tokens.color.brandLight,
    },
    divider: tokens.color.gray500,
    warning: {
      main: tokens.color.warningAmber,
    },
    success: {
      main: tokens.color.successGreen,
      light: tokens.color.successGreenLight,
    },
    error: {
      main: tokens.color.errorRed,
      light: tokens.color.errorRedLight,
      dark: tokens.color.errorRedDark,
    },
  },
  typography: {
    fontFamily: tokens.typography.fontFamily.primary,
    h1: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.fontWeights.bold,
      fontSize: "2.5rem",
    },
    h2: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.fontWeights.medium,
      fontSize: "2rem",
    },
    h3: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.fontWeights.medium,
      fontSize: "1.875rem",
    },
    h4: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.fontWeights.medium,
      fontSize: "1.75rem",
    },
    h5: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.fontWeights.medium,
      fontSize: "1.25rem",
    },
    h6: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.fontWeights.medium,
      fontSize: "1.2rem",
    },
    body1: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontSize: "1rem",
    },
    body2: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.color.brand,
          color: tokens.color.white,
          "&:hover": {
            backgroundColor: tokens.color.brandDark,
          },
          ":focus": {
            outline: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: tokens.color.brand,
          ":focus": {
            outline: "none",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.color.brand,
          color: tokens.color.white,
          "&:hover": {
            backgroundColor: tokens.color.brandDark,
          },
          ":focus": {
            outline: "none",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: tokens.typography.fontFamily.primary,
          fontSize: "1rem",
          color: tokens.color.brand,
          "&:hover": {
            color: tokens.color.brandDark,
          },
        },
      },
    },
  },
});
