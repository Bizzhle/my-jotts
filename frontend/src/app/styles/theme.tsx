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
          color: "#0268B0",
          "&:hover": {
            BorderColor: "#0268B0",
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
