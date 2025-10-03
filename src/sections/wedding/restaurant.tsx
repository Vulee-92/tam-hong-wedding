/* eslint-disable */

import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Stack, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { weddingStyles } from './styles';


// Dữ liệu mẫu đã được cập nhật để bao gồm các trường bị thiếu
const weddingData = {
  events: [
    {
      date: "11-10-2025",
      day: "THỨ 7",
      time: "19:00 - 22:00",
      restauracnceName: "NHÀ HÀNG AQUA JARDIN",
      location: "307 Nơ Trang Long, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
      dressCode: "Trang trọng",
    }
  ],
  mapLink: "https://maps.app.goo.gl/your-map-link",
  phone: "0901234567",
};

const RootStyle = styled('div')(({ theme }) => ({
  ...weddingStyles.components.section(theme),
  background: '#fcfcfc',
  position: 'relative',
  padding: theme.spacing(10, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 1),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Oooh Baby', cursive",
  fontSize: 'clamp(2rem, 5vw, 2.5rem)',
  color: weddingStyles.colors.text,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const CardContainer = styled(motion.div)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  background: '#fff',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.06)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const MapPlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '250px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  position: 'relative',
  marginBottom: theme.spacing(2),
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  borderBottom: `1px dashed ${weddingStyles.colors.secondary}`,
  '&:last-of-type': {
    borderBottom: 'none',
  }
}));

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

export function RestaurantInfoSection() {
    const { events, mapLink, phone } = weddingData;
    const event = events[0];
    
    return (
        <RootStyle id="restaurant-info">
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <SectionTitle>
                        Địa Điểm Tổ Chức
                    </SectionTitle>
                </motion.div>

                <CardContainer
                    initial="hidden"
                    whileInView="visible"
                    variants={itemVariants}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <Stack spacing={4}>
                        <motion.div variants={itemVariants}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontFamily: "'Playfair Display', serif", 
                                    fontWeight: 'bold', 
                                    textAlign: 'center', 
                                    textTransform: 'uppercase' 
                                }}
                            >
                                {event.restauracnceName}
                            </Typography>
                            <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
                                {event.location}
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <MapPlaceholder>
                                {/* Thay thế bằng hình ảnh bản đồ tĩnh hoặc Google Maps Embed API */}
                                <img src="/path/to/your/map-image.jpg" alt="Map" />
                            </MapPlaceholder>
                        </motion.div>

                        <motion.div variants={staggerContainer}>
                            <ActionButtons>
                                <motion.div variants={itemVariants}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Iconify icon="mdi:map-marker-outline" />}
                                        href={mapLink}
                                        target="_blank"
                                        sx={{ 
                                            textTransform: 'none', 
                                            fontFamily: "'Playfair Display', serif",
                                            borderColor: '#e0e0e0',
                                            color: '#000'
                                        }}
                                    >
                                        Chỉ Đường
                                    </Button>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Iconify icon="mdi:phone-outline" />}
                                        href={`tel:${phone}`}
                                        sx={{ 
                                            textTransform: 'none', 
                                            fontFamily: "'Playfair Display', serif",
                                            borderColor: '#e0e0e0',
                                            color: '#000'
                                        }}
                                    >
                                        Gọi Điện
                                    </Button>
                                </motion.div>
                            </ActionButtons>
                        </motion.div>

                        <motion.div variants={staggerContainer}>
                            <InfoItem >
                                <Typography sx={{ color: '#666' }}>Thời gian:</Typography>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                                    {event.time}
                                </Typography>
                            </InfoItem>
                            <InfoItem >
                                <Typography sx={{ color: '#666' }}>Ngày:</Typography>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                                    {event.day}, {event.date}
                                </Typography>
                            </InfoItem>
                            <InfoItem >
                                <Typography sx={{ color: '#666' }}>Dress code:</Typography>
                                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                                    {event.dressCode}
                                </Typography>
                            </InfoItem>
                        </motion.div>
                    </Stack>
                </CardContainer>
            </Container>
        </RootStyle>
    );
}