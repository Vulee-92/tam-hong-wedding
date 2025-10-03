/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, alpha, Theme, useTheme } from '@mui/material/styles';
import { Box, Container, Typography, Grid, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, X } from 'lucide-react'; // Sử dụng Lucide React cho các icon
import { weddingData } from './weddingData';

// Dữ liệu ảnh và thông tin tiệc cưới


const weddingStyles = {
  colors: {
    primary: '#C62828',
    text: '#000',
  },
};

// Styled components
const RootStyle = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  // backgroundImage: 'url("https://res.cloudinary.com/difiyurn7/image/upload/v1754986206/ChatGPT_Image_15_09_58_12_thg_8_2025_jjdwwo.png")',
  // backgroundSize: 'cover',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8, 0),

  maskImage: `linear-gradient(to bottom, black, black 100%, transparent 50%)`,
  maskSize: '100% 100%',
  WebkitMaskImage: `linear-gradient(to bottom, black, black 100%, transparent 50%)`,
  WebkitMaskSize: '100% 100%',
}));

const MainTitle = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  maxWidth: '450px',
  margin: '0 auto',
  '& .title-handwriting': {
    fontFamily: "'Oooh Baby', serif !important",
      fontSize: 'clamp(1.75rem, 5vw, 3rem)',

    color: weddingStyles.colors.primary,
    fontWeight: 400,
  },
  '& .title-sans': {
    fontFamily: "'SVN-GothamLight', serif !important",
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    color: '#000',
    fontWeight: 500,
    marginTop: theme.spacing(1),
  },
}));

const ImageContainer = styled(motion.div)<{ isLarge?: boolean }>(({ theme, isLarge }) => ({
  width: '100%',
  height: isLarge ? 192 : 128,
  [theme.breakpoints.up('sm')]: {
    height: isLarge ? 240 : 160,
  },
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: '1px solid #e5e7eb',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  cursor: 'pointer',
}));

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: weddingStyles.colors.primary,
  color: 'white',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(1.5),
  fontFamily: "'SVN-GothamLight', serif !important",
  fontSize: '0.9rem',
  fontWeight: 400,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#374151',
    transform: 'scale(1.05)',
    boxShadow: `0 4px 15px ${alpha(weddingStyles.colors.primary, 0.4)}`,
  },
}));

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
}

const GalleryOverlay = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  maxWidth: '600px',
  margin: '0 auto',
  inset: 0,
  zIndex: 1300,
  backgroundColor: 'rgba(0,0,0,0.9)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

const GalleryIntro = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  backgroundColor: 'black',
  '& .spotlight': {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 50%)',
    animation: 'fadeIn 2s ease forwards',
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 1 },
    '100%': { opacity: 1 },
  },
  '& .column-container': {
    display: 'flex',
    height: '100%',
  },
}));
const IntroText = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'white',
  fontFamily: "'SVN-GothamLight', serif !important",
  fontSize: '1rem',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  textShadow: '0 0 10px rgba(255,255,255,0.8)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '8px 16px',
  borderRadius: '8px',
}));
// Components
const PhotoGallery = React.memo(({ isOpen, onClose, photos }: PhotoGalleryProps) => {
  // === HOOKS PHẢI LUÔN ĐƯỢC GỌI Ở ĐẦU COMPONENT ===
  const [showIntro, setShowIntro] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const theme = useTheme();

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  const nextPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  }, [handleClose, nextPhoto, prevPhoto]);
  // Variants for the typing effect
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  };
  // Use useMemo for heavy calculations outside of any conditional returns
  const extendedPhotos = useMemo(() => [...photos, ...photos, ...photos], [photos]);
  const column1 = useMemo(() => extendedPhotos.filter((_, index) => index % 3 === 0), [extendedPhotos]);
  const column2 = useMemo(() => extendedPhotos.filter((_, index) => index % 3 === 1), [extendedPhotos]);
  const column3 = useMemo(() => extendedPhotos.filter((_, index) => index % 3 === 2), [extendedPhotos]);
  const typingText = "Album ảnh sắp mở... ";
  const textArray = typingText.split('');
  useEffect(() => {
    if (isOpen) {
      setShowIntro(true);
      setShowGallery(false);
      setCurrentPhoto(0);
      setIsClosing(false);
      setIntroFading(false);
      document.body.style.overflow = "hidden";

      const fadeTimer = setTimeout(() => {
        setIntroFading(true);
      }, 6000);

      const timer = setTimeout(() => {
        setShowIntro(false);
        setTimeout(() => setShowGallery(true), 300);
      }, 4000);

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, handleKeyDown]);
  // === KẾT THÚC CÁC HOOKS ===

  // Câu lệnh return điều kiện sau khi tất cả các hook đã được gọi
  if (!isOpen) return null;

  return (
    <GalleryOverlay
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: 50,
          color: 'white',
          bgcolor: 'rgba(255,255,255,0.2)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' },
        }}
      >
        <X />
      </IconButton>

      {/* Intro Columns */}
      {showIntro && (
        <GalleryIntro
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: introFading ? 0 : 1, scale: introFading ? 0.95 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="spotlight" />
          <Box className="column-container">
            {/* Column 1 - Moving Up */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(1), px: theme.spacing(1), animation: 'slideUp 5s linear infinite' }}>
              {column1.map((photo, index) => (
                <Box key={`col1-${index}`} sx={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', minHeight: '200px' }}>
                  <img src={photo || "/placeholder.svg"} alt={`Wedding photo ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </Box>
              ))}
            </Box>
            {/* Column 2 - Moving Down */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(1), px: theme.spacing(1), animation: 'slideDown 5s linear infinite' }}>
              {column2.map((photo, index) => (
                <Box key={`col2-${index}`} sx={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', minHeight: '220px' }}>
                  <img src={photo || "/placeholder.svg"} alt={`Wedding photo ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </Box>
              ))}
            </Box>
            {/* Column 3 - Moving Up (Delayed) */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(1), px: theme.spacing(1), animation: 'slideUp 5s linear infinite' }}>
              {column3.map((photo, index) => (
                <Box key={`col3-${index}`} sx={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', minHeight: '200px' }}>
                  <img src={photo || "/placeholder.svg"} alt={`Wedding photo ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </Box>
              ))}
            </Box>
          </Box>
          <style>{`
            @keyframes slideUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
            @keyframes slideDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
          `}</style>
          <IntroText
            variants={container}
            initial="hidden"
            animate="show"
          >
            {textArray.map((char, index) => (
              <motion.span key={index} variants={item}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </IntroText>
        </GalleryIntro>
      )}

      {/* Gallery Viewer */}
      {showGallery && (
        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 1, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Main Photo */}
          <Box sx={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.img
              key={currentPhoto}
              loading="lazy"
              src={photos[currentPhoto] || "/placeholder.svg"}
              alt={`Wedding photo ${currentPhoto + 1}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
              initial={{ scale: 0.9, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <Typography variant="caption" sx={{ position: 'absolute', bottom: theme.spacing(2), left: '50%', transform: 'translateX(-50%)', bgcolor: 'rgba(0,0,0,0.7)', color: 'white', px: 2, py: 1, borderRadius: '24px' }}>
              {currentPhoto + 1} / {photos.length}
            </Typography>
          </Box>

          {/* Navigation Arrows */}
          <IconButton
            onClick={prevPhoto}
            sx={{ position: 'absolute', left: theme.spacing(2), top: '50%', transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={nextPhoto}
            sx={{ position: 'absolute', right: theme.spacing(2), top: '50%', transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}
          >
            <ChevronRight />
          </IconButton>

          {/* Thumbnail Strip */}
          <Box sx={{ position: 'absolute', bottom: theme.spacing(2), left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: theme.spacing(1), bgcolor: 'rgba(0,0,0,0.5)', p: 1, borderRadius: '24px', overflowX: 'auto', maxWidth: '100%', [theme.breakpoints.up('sm')]: { maxWidth: 'md' } }}>
            {photos.map((photo, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPhoto(index)}
                sx={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: index === currentPhoto ? `2px solid white` : `2px solid transparent`,
                  transition: 'border-color 0.3s ease',
                  flexShrink: 0,
                  '&:hover': { borderColor: 'grey.300' }
                }}
              >
                <img src={photo || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
        </motion.div>
      )}
    </GalleryOverlay>
  );
});

// Component chính
export function GallerySection() {
  const [showGallery, setShowGallery] = useState(false);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.6, 0.05, -0.01, 0.9] } },
  };

  return (
    <>
      <RootStyle id="section-4">
        <Container maxWidth="sm">
          <MainTitle
            initial={{ opacity: 1, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <Typography className="title-handwriting">
              {weddingData.mainTitle}
            </Typography>
            <Typography className="title-sans">
              {weddingData.subtitle}
            </Typography>
            <Box sx={{ width: '100%', mt: 4 }} />
          </MainTitle>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid item xs={4}>
                <motion.div variants={itemVariants}>
                  <ImageContainer onClick={() => setShowGallery(true)}>
                    <StyledImage src={weddingData.images.albumPhotos[11]} alt="Wedding Photo" loading="lazy" />
                  </ImageContainer>
                </motion.div>
              </Grid>
              <Grid item xs={4}>
                <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
                  <ImageContainer isLarge onClick={() => setShowGallery(true)}>
                    <StyledImage src={weddingData.images.albumPhotos[4]} alt="Wedding Photo" loading="lazy" />
                  </ImageContainer>
                </motion.div>
              </Grid>
              <Grid item xs={4}>
                <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
                  <ImageContainer onClick={() => setShowGallery(true)}>
                    <StyledImage src={weddingData.images.albumPhotos[3]} alt="Wedding Photo" loading="lazy" />
                  </ImageContainer>
                </motion.div>
              </Grid>
            </Grid>

            <Grid container spacing={1.5}>
              <Grid item xs={4}>
                <motion.div variants={itemVariants} transition={{ delay: 0.6 }}>
                  <ImageContainer  onClick={() => setShowGallery(true)}>
                    <StyledImage src={weddingData.images.albumPhotos[16]} alt="Wedding Photo" loading="lazy" />
                  </ImageContainer>
                </motion.div>
              </Grid>
              <Grid item xs={4}>
                <motion.div variants={itemVariants} transition={{ delay: 0.8 }}>
                  <ImageContainer isLarge onClick={() => setShowGallery(true)}>
                    <StyledImage src={weddingData.images.albumPhotos[18]} alt="Wedding Photo" loading="lazy" />
                  </ImageContainer>
                </motion.div>
              </Grid>
              <Grid item xs={4}>
                <motion.div variants={itemVariants} transition={{ delay: 0.8 }}>
                  <ImageContainer  onClick={() => setShowGallery(true)}>
                    <StyledImage src={weddingData.images.albumPhotos[17]} alt="Wedding Photo" loading="lazy" />
                  </ImageContainer>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <motion.div
              initial={{ opacity: 1, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
            >
              <StyledButton onClick={() => setShowGallery(true)}>
                Xem Thêm Ảnh
              </StyledButton>
            </motion.div>
          </Box>
        </Container>
      </RootStyle>

      <PhotoGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        photos={weddingData.images.albumPhotos}
      />
    </>
  );
}


