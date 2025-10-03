import React from 'react';
import { Dialog, Box, Typography, Button, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 16,
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    maxWidth: 400,
    overflow: 'hidden',
    position: 'relative',
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  position: 'relative',
}));

// Variants cho pop-up
const popupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

interface PhotoBoothPopupProps {
  onClose: () => void;
  open: boolean;
}

export const PhotoBoothPopup = ({ onClose, open }: PhotoBoothPopupProps) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      component={motion.div}
    >
      <Box sx={{ position: 'relative' }}>
        <img
          src="https://res.cloudinary.com/dxfsa7foy/image/upload/v1755793427/IMG_7490_q2vibl.jpg" // Ảnh banner photobooth
          alt="PhotoBooth"
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.4)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <ContentBox>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: '#928362',
            mb: 1,
          }}
        >
          Trải nghiệm PhotoBooth
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            color: 'text.secondary',
            mb: 2,
          }}
        >
          Ghi lại những khoảnh khắc đáng nhớ cùng cô dâu chú rể!
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            // Xử lý hành động khi bấm nút, ví dụ chuyển hướng
            window.open('/photobooth-experience', '_blank');
            onClose();
          }}
          sx={{
            background: `linear-gradient(45deg, #928362, #D2B48C)`,
            color: '#fff',
            py: 1.5,
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textTransform: 'none',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Khám phá ngay!
        </Button>
      </ContentBox>
    </StyledDialog>
  );
};