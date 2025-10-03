import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoBoothPopup } from './PhotoBoothPopup';
import { useNavigate } from 'react-router-dom';
import { weddingData } from '../wedding/weddingData';

const WelcomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const navigate = useNavigate();
  const handleEnterWebsite = () => {
    navigate('/link-generator');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowMainContent(true); // Hiển thị nội dung trang chủ sau khi tắt pop-up
  };

  // Variants cho hiệu ứng chuyển động
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundImage: `url(${weddingData.images.mobilePhoto})`, // Ảnh nền
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        color: '#fff',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ zIndex: 1, position: 'relative' }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '5rem' },
            fontWeight: 600,
            textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          Xin chào, {weddingData.groom.nameOnly} & {weddingData.bride.nameOnly}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1rem', md: '2rem' },
            mt: 2,
            textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          Chào mừng đến với hệ thống quản lý thiệp
        </Typography>
        <Button
          onClick={handleEnterWebsite}
          variant="contained"
          sx={{
            background: `linear-gradient(45deg, #928362, #D2B48C)`,
            color: '#fff',
            mt: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          Vào Trang Chủ
        </Button>
      </motion.div>

      <AnimatePresence>
        {showPopup && <PhotoBoothPopup onClose={handleClosePopup} open={showPopup} />}
      </AnimatePresence>

      {/* Tùy chọn: Hiển thị nội dung trang chủ sau khi pop-up tắt */}
      {showMainContent && (
        <Box sx={{ p: 4 }}>
          {/* Nội dung trang chủ của bạn ở đây */}
          <Typography variant="h4" color="white">
            Đây là trang chủ của bạn
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WelcomePage;