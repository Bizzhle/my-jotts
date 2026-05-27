import { tokens } from "./src/app/styles/tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: tokens.color.brand,
        "brand-dark": tokens.color.brandDark,
        "brand-light": tokens.color.brandLight,
        white: tokens.color.white,
        black: tokens.color.black,
        gray: {
          50: tokens.color.gray50,
          100: tokens.color.gray100,
          200: tokens.color.gray200,
          500: tokens.color.gray500,
          700: tokens.color.gray700,
          900: tokens.color.gray900,
        },
        warning: tokens.color.warningAmber,
        success: tokens.color.successGreen,
        "success-light": tokens.color.successGreenLight,
        error: tokens.color.errorRed,
        "error-light": tokens.color.errorRedLight,
        "error-dark": tokens.color.errorRedDark,
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
        xxl: tokens.spacing.xxl,
      },
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        xl: tokens.radius.xl,
      },
    },
  },
  plugins: [],
};
