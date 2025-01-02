import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      light: "#ECECEC",
      dark: "#DEDEE0",
    },
    secondary: {
      main: "#000",
      light: "#5C5C5F",
    },
    divider: "#5C5C5F",
  },
  typography: {
    body2: {
      fontSize: 10,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c5c51",
          color: "#fff",
          "&:hover": {
            backgroundColor: "darkgreen",
          },
        },
      },
    },
  },
});
