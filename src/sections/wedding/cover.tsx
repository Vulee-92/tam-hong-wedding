/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { weddingData } from './weddingData';
import { Iconify } from 'src/components/iconify';

const palePink = '#fdcdddff';
const lightAqua = '#e0f7fa';

const backgroundImages = [
    "https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212501/h10_buoyak.jpg",
];

const RootStyle = styled('div')(({ theme }) => ({
  height: '97vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  // backgroundColor: lightAqua,
}));

// New styled component for the intro effect overlay
const IntroOverlay = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 100,
  // backgroundColor: 'rgba(255, 100, 100, 0.5)', // A warm red/pink color
  pointerEvents: 'none',
}));

const BackgroundImage = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
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

const TopName = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  position: 'absolute',
  top: theme.spacing(0),
  transform: 'translateX(-50%) rotate(-5deg)',
  transformOrigin: 'center center',
  zIndex: 10,
  fontFamily: "'Oooh Baby', cursive",
  fontSize: '2rem',
  color: '#fff',
  fontWeight: 500,
  fontStyle: 'italic',
  textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    top: theme.spacing(1),
  },
}));

const InfoBox = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(5),
  right: theme.spacing(4),
  zIndex: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2, 3),
  textAlign: 'center',
  backdropFilter: 'blur(2px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(4),
    right: theme.spacing(2),
    padding: theme.spacing(1.5, 2.5),
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

export function CoverSection() {
  const [swipeOpacity, setSwipeOpacity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Hide the intro overlay after 1 second
    setTimeout(() => {
      setShowIntro(false);
    }, 1500);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollY / 100);
      setSwipeOpacity(newOpacity);
    };
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setCurrentImage((prevImage) =>
        (prevImage + 1) % backgroundImages.length
      );
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <RootStyle>
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      <BackgroundImage>
        <AnimatePresence>
          <motion.img
            key={currentImage}
            src={backgroundImages[currentImage]}
            alt={`Wedding Image ${currentImage + 1}`}
            // New "Crossfade & Rotate" effect
            loading="lazy"
            initial={{ opacity: 0, scale: 1.05, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotate: -1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
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
          initial={{ opacity: 0, y: -20, rotate: -5 }}
          animate={{ opacity: 1, y: 30, rotate: -5 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Hữu Tâm - Nguyễn Hồng
        </TopName>
        <InfoBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Typography sx={{    fontFamily: "'TPLeMajor', serif !important", fontSize: '0.8rem', color: '#fff', textAlign: 'center', letterSpacing: '0.1em', opacity: 0.9 }}>
            Thiệp thành hôn
          </Typography>
          <Divider />
          <Typography sx={{       fontFamily: "'Playfair Display', serif",
fontSize: '0.9rem',  color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>
            CHỦ NHẬT
          </Typography>
          <Typography sx={{    fontFamily: "'TPLeMajor', serif !important",fontSize: '0.8rem', color: '#fff', textAlign: 'center', letterSpacing: '0.05em' }}>
            12 . 10 . 2025
          </Typography>
          <DividerPink />
        </InfoBox>
      </Container>
    </RootStyle>
  );
}