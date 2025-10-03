/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

const palePink = '#fdcdddff';
const lightAqua = '#e0f7fa';

const backgroundImages = [
  'https://res.cloudinary.com/dq0fochj2/image/upload/v1759212505/h30_zperrt.jpg',
];

const RootStyle = styled('div')(({ theme }) => ({
  height: '100vh', 
  display: 'flex',
    maxWidth: 600,
    margin: '0 auto',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `url('https://res.cloudinary.com/difiyurn7/image/upload/v1754986206/ChatGPT_Image_15_09_58_12_thg_8_2025_jjdwwo.png')`,
  backgroundSize: 'cover',
}));

const IntroOverlay = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 100,
  pointerEvents: 'none',
  backgroundColor: 'rgba(255, 255, 255, 1)',
}));

const BackgroundImage = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
    maxWidth: 600,
    margin: '0 auto',
  bottom: 0,
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.02), rgba(255,255,255,0.05))',
    backdropFilter: 'blur(0px)',
    zIndex: 1,
  },
  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    opacity: 0.8,
    filter: 'contrast(102%)',
  },
}));
const TopCurveTransition = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: -1,
  left: 0,
  width: '100%',
  height: '120px',
  zIndex: 5,
  overflow: 'hidden',
  transform: 'rotate(180deg)',
  '& svg': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fill: theme.palette.background.paper,
    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.02))',
  }
}));
const WaveTransition = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: -2,
  left: 0,
  width: '100%',
  height: '50px',
  zIndex: 2,
  overflow: 'hidden',
  '& svg': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fill: theme.palette.background.paper,
  },
}));

// TopName styled component

const TopName = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  position: 'absolute',
  top: theme.spacing(2),
  transform: 'translateX(-50%) rotate(-5deg)',
  transformOrigin: 'center center',
  zIndex: 10,
  fontFamily: "'Oooh Baby', cursive",
  fontSize: '3rem',
   color: "#C62828",
  fontWeight: 500,
  fontStyle: 'italic',
     textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #f8d0e0',
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
    top: theme.spacing(5),
  },
}));
const TopItemName = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  position: 'absolute',
  top: theme.spacing(11),
  transform: 'translateX(-50%) rotate(-5deg)',
  transformOrigin: 'center center',
  zIndex: 10,
  fontFamily: "'TAN-PEARL', cursive",
  fontSize: '1.5rem',
   color: "#C62828",

  fontWeight: 500,
  fontStyle: 'italic',
     textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #f8d0e0',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.3rem',
    top: theme.spacing(11),
  },
}));

const InfoBox = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(5),
  right: theme.spacing(4),
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.01)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2, 3),
  textAlign: 'center',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(4),
    right: theme.spacing(2),
    padding: theme.spacing(1, 2),
  },
}));

const Divider = styled(Box)(({ theme }) => ({
  width: '70%',
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  margin: theme.spacing(1.5, 0),
}));

const DividerPink = styled(Box)(({ theme }) => ({
  width: '70%',
  height: '1px',
  backgroundColor: palePink,
  margin: theme.spacing(1.5, 0),
}));

const SwipeIndicator = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  bottom: '0%', // Đã thay đổi từ '94%' thành '10%' để cố định vị trí
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 100,
  gap: theme.spacing(1),
  color: '#000',
  opacity: 0.8,
  animation: 'swipeAnimation 2s infinite',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
  '@keyframes swipeAnimation': {
    '0%, 100%': {
      transform: 'translate(-50%, 0%)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'translate(-50%, -10px)',
      opacity: 1,
    },
  },
}));

export function CoverBottomSection() {
  const [swipeVisible, setSwipeVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Hiệu ứng Fade out của IntroOverlay
    const introTimeout = setTimeout(() => {
      // Khi intro biến mất, bắt đầu hiển thị swipe indicator
      setSwipeVisible(true);
    }, 1500);

    // Scroll listener
    const handleScroll = () => {
      // Ẩn swipe khi người dùng cuộn xuống
      if (window.scrollY > 50) {
        setSwipeVisible(false);
      } else {
        setSwipeVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Background auto change
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => {
      clearTimeout(introTimeout);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <RootStyle>
      <AnimatePresence>
        {/* Intro Overlay chỉ hiển thị ban đầu, sau đó fade out */}
        <IntroOverlay
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>
  <TopCurveTransition>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill='#000'
        >
          <path
            d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,122.7C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </TopCurveTransition>
      <BackgroundImage>
        <AnimatePresence>
          <motion.img
            key={currentImage}
            src={backgroundImages[currentImage]}
            alt={`Wedding Image ${currentImage + 1}`}
            // Loại bỏ hoàn toàn scale và rotate để tránh vấn đề trên di động
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </BackgroundImage>

      <WaveTransition>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,122.7C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </WaveTransition>

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TopName
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Bắc Ninh
        </TopName>
  <TopItemName
          initial={{ opacity: 0, y: -20, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          12 tháng 10
        </TopItemName>
   
      </Container>
    </RootStyle>
  );
}