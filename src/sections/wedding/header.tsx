import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Container, Box, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { weddingStyles } from './styles';

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 80;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: 'transparent',
  transition: 'background-color 0.3s ease',
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
  },
}));

const ToolbarStyle = styled('div')(({ theme }) => ({
  height: HEADER_MOBILE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const NavItems = [
  { label: 'Welcome', href: '#welcome' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'Our Story', href: '#story' },
  { label: 'Contact', href: '#contact' },
];

export function WeddingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <RootStyle
      sx={{
        bgcolor: isScrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
      }}
    >
      <Container maxWidth="lg">
        <ToolbarStyle>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {NavItems.map((item) => (
              <Box
                key={item.label}
                component="a"
                href={item.href}
                sx={{
                  color: weddingStyles.colors.text,
                  textDecoration: 'none',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: weddingStyles.colors.primary,
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>

          <IconButton
            sx={{
              display: { xs: 'block', md: 'none' },
              color: weddingStyles.colors.text,
            }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        </ToolbarStyle>
      </Container>
    </RootStyle>
  );
} 