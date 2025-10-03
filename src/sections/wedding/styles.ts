import { Theme } from "@mui/material";

export const weddingStyles = {
  // Colors
  colors: {
    primary: '#9E8A78', // Màu nâu vàng sang trọng
    secondary: '#F5F5F5', // Màu xám nhẹ
    accent: '#D4C4B7', // Màu be nhạt
    background: '#FFFFFF', // Màu trắng
    text: '#00000', // Màu đen nhạt
  },
  
  // Typography
  typography: {
    h1: (theme: Theme) => ({
      fontFamily: "'Playfair Display', serif",
      fontSize: '3.5rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '2.5rem',
      },
    }),
    h2: (theme: Theme) => ({
      fontFamily: "'Playfair Display', serif",
      fontSize: '2.5rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
      },
    }),
    body1: (theme: Theme) => ({
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '1rem',
    }),
  },

  // Common components
  components: {
    section: (theme: Theme) => ({
      padding: theme.spacing(10, 0),
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(6, 0),
      },
    }),
    container: (theme: Theme) => ({
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing(0, 2),
    }),
  },
}; 