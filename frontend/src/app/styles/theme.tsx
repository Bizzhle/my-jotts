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
      dark: "#108BE3",
    },
    divider: "#5C5C5F",
    success: {
      main: "#D48B1C",
      light: "#A5D6A7",
      dark: "#388E3C",
    },
    error: {
      main: "#D32F2F",
      light: "#EF9A9A",
      dark: "#C62828",
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Poppins', 'sans-serif'",
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: "2rem",
    },
    h3: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: "1.875rem",
    },
    h4: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: "1.75rem",
    },
    h5: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h6: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    body1: {
      fontFamily: "'Montserrat', 'sans-serif'",
      fontSize: "1rem",
    },
    body2: {
      fontFamily: "'Montserrat', 'sans-serif'",
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#108BE3",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0268B0",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // backgroundColor: "#108BE3",
          color: "#108BE3",
          "&:hover": {
            BorderColor: "#0268B0",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "#108BE3",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0268B0",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#108BE3",
          "&:hover": {
            color: "#0268B0",
          },
        },
      },
    },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       "& .MuiInputBase-root": {
    //         backgroundColor: "#f5f5f5",
    //       },
    //       "& .MuiOutlinedInput-root": {
    //         "& fieldset": {
    //           borderColor: "#ccc",
    //         },
    //         "&:hover fieldset": {
    //           borderColor: "#888",
    //         },
    //         "&.Mui-focused fieldset": {
    //           borderColor: "#000",
    //         },
    //       },
    //     },
    //   },
    // },
  },
});
