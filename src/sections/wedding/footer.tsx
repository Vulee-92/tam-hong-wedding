import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { weddingStyles } from './styles';
import { weddingData } from './weddingData';

const RootStyle = styled('footer')(({ theme }) => ({
  padding: theme.spacing(5, 0),
  backgroundColor: weddingStyles.colors.secondary,
  textAlign: 'center',
  backgroundImage: 'url("https://res.cloudinary.com/difiyurn7/image/upload/v1754986206/ChatGPT_Image_15_09_58_12_thg_8_2025_jjdwwo.png")',
  backgroundSize: 'cover',
}));

export function WeddingFooter() {
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            color: weddingStyles.colors.text,
        fontFamily: "'Oooh Baby', serif !important",

          }}
        >
          © {new Date().getFullYear()} {weddingData.groom.name} & {weddingData.bride.name}
        </Typography>
      </Container>
    </RootStyle>
  );
} 



