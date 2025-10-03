/* eslint-disable */
import React from 'react';
import { Dialog, Box, Typography, Button, IconButton, Stack } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { weddingData } from 'src/sections/wedding/weddingData';

const StyledDialog = styled(motion(Dialog))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: 750,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  flex: '0 0 40%',
  backgroundImage: `url(${weddingData.images.mobilePhoto})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    height: 200,
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const dialogVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
};

interface PhotoBoothDialogProps {
  open: boolean;
  onClose: () => void;
}

const PHOTOBOOTH_LINK = 'https://photobooth-mowedding.vercel.app/';
const QR_CODE_URL = '/assets/photobooth/qrcode_link.png';

export const PhotoBoothDialog = ({ open, onClose }: PhotoBoothDialogProps) => {
  const [linkCopied, setLinkCopied] = React.useState(false);
  const theme = useTheme();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(PHOTOBOOTH_LINK);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <StyledDialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="lg"
          component={motion.div}
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 16, right: 16, color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>

          <ImageContainer />

          <ContentContainer>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Trải nghiệm PhotoBooth ngay hôm nay 🎉
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Hãy bắt đầu lưu giữ khoảnh khắc thật vui nhộn bằng một trong hai cách sau:
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
              {/* QR Option */}
              <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quét mã QR
                </Typography>
                <Box
                  component="img"
                  src={QR_CODE_URL}
                  alt="QR Code"
                  sx={{ width: 200, height: 130, mx: 'auto', mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Mở camera và quét để tham gia.
                </Typography>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Dùng link
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleCopyLink}
                  startIcon={linkCopied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                  
                  }}
                >
                  {linkCopied ? 'Đã sao chép!' : 'Sao chép link'}
                </Button>
              </Box>

           
            </Stack>

           
             
          </ContentContainer>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};
