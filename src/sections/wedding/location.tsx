import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { weddingStyles } from './styles';

const RootStyle = styled('div')(({ theme }) => ({
  ...weddingStyles.components.section(theme),
  background: '#fff',
  position: 'relative',
}));

const MapContainer = styled(Box)(({ theme }) => ({
  height: 450,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  border: `1px solid ${weddingStyles.colors.secondary}`,
}));

export function LocationSection() {
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              ...weddingStyles.typography.h2,
              mb: 4
            }}
          >
            Địa Điểm Tổ Chức
          </Typography>

          <MapContainer>
            <iframe
              title="Địa điểm tổ chức lễ cưới"
              src="https://www.google.com/maps/embed?pb=..."
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </MapContainer>
        </motion.div>
      </Container>
    </RootStyle>
  );
} 