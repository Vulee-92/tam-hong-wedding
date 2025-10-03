import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledUnderline = styled(Box)({
  position: 'relative',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    textAlign: 'center',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '280px',
    height: '25px',
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1213 73"><path d="M1212.41 5.51c3.05 12.87-22.36 11.93-30.26 15.68-94.32 20.51-269.09 32.42-365.48 37.51-77.91 3.82-155.66 9.93-233.67 11.67-57.49 2.56-115.05-.19-172.57 1.58-121.28.91-243.17 1.88-363.69-13.33-12.51-2.64-25.8-2.92-37.77-7.45-30.66-21.42 26.02-21.53 38.52-19.26 359.95 29.05 364.68 27.36 638.24 17.85 121-3.78 241.22-19.21 426.76-41.46 4.72-.65 9.18 3.56 8.45 8.36a941.74 941.74 0 0 0 54.29-9.21c9.33-2.33 18.7-4.56 27.95-7.19a7.59 7.59 0 0 1 9.23 5.24Z" fill="%23000"></path></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    opacity: 0.7
  }
});

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  sx?: object;
}

export function SectionHeading({ title, subtitle, sx }: SectionHeadingProps) {
  return (
    <>
      <StyledUnderline>
        <Typography 
          sx={{ 
            color: '#000000',
            textAlign: 'center',
            fontFamily: 'Hubot Sans',
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 700,
            mb: 3,
            letterSpacing: '-0.02em',
            display: 'block',
            ...sx
          }}
        >
          {title}
        </Typography>
      </StyledUnderline>

      {subtitle && (
        <Typography 
          align="center" 
          sx={{ 
            color: 'text.secondary',
            mb: 10,
            mt: 2,
            mx: 'auto',
            fontSize: { xs: '1.1rem', md: '1.2rem' },
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
} 