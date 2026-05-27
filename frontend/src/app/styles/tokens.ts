/**
 * Design Tokens - Single source of truth for all colors and spacing
 * Imported by theme.tsx and tailwind.config.js to ensure consistency
 */

export const tokens = {
  color: {
    // Brand colors
    brand: "#108BE3",
    brandDark: "#0268B0",
    brandLight: "#E3F2FD",

    // Neutral colors
    white: "#fff",
    black: "#000",
    gray50: "#FAFAFA",
    gray100: "#ECECEC",
    gray200: "#DEDEE0",
    gray500: "#5C5C5F",
    gray700: "#424242",
    gray900: "#212121",

    // Semantic colors
    warningAmber: "#D48B1C",
    successGreen: "#388E3C",
    successGreenLight: "#A5D6A7",
    errorRed: "#D32F2F",
    errorRedLight: "#EF9A9A",
    errorRedDark: "#C62828",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },

  typography: {
    fontFamily: {
      primary: "'Montserrat', sans-serif",
      secondary: "'Poppins', sans-serif",
      fallback: "'sans-serif'",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

export type Tokens = typeof tokens;
