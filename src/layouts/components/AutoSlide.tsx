import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Define the interface for a single image object
interface ProcessImage {
  src: string;
  alt: string;
  note: string;
}

interface AutoSlideProps {
  images: ProcessImage[];
}

const AutoSlide = ({ images }: AutoSlideProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logic for automatic slide transition every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Manual slide navigation
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  // Manual dot navigation
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 220, mx: 'auto' }}>
      {/* Note/Description section */}
      <Typography
        sx={{
          mb: 1,
          color: 'text.secondary',
          textAlign: 'center',
          fontSize: "10px",
          fontStyle: 'italic',
          height: 35,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {images[currentIndex].note}
      </Typography>

      {/* Image container with fixed dimensions */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: 150,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      }}>
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              component="img"
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation arrows positioned outside the image container */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: -15, // Move outside to the left
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'grey.600', // Change color to be visible on the background
          bgcolor: 'rgba(255,255,255,0.7)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)',
          },
          zIndex: 1,
        }}
      >
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: -15, // Move outside to the right
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'grey.600', // Change color
          bgcolor: 'rgba(255,255,255,0.7)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)',
          },
          zIndex: 1,
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      {/* Dots indicator at the bottom */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: index === currentIndex ? 'primary.main' : 'grey.400',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default AutoSlide;