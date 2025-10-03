import React, { useState } from 'react';
import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { textGradient } from 'src/theme/styles';
import AutoSlide from './AutoSlide';
import { Typography } from '@mui/material';
import { PhotoBoothDialog } from './PhotoBoothDialog';

const processImages = [
  {
    src: '/assets/photobooth/qrcode-table.jpg',
    alt: 'Scan QR Code',
    note: '1. Quét mã QR tại bàn tiệc',
  },
    {
    src: '/assets/photobooth/khachscan.png',
    alt: 'Scan QR Code',
    note: '1. Quét mã QR tại bàn tiệc',
  },
  {
    src: '/assets/photobooth/khachchup.png',
    alt: 'Take Photo',
    note: '2. Chọn góc đẹp và chụp ảnh',
  },
  {
    src: '/assets/photobooth/daurexemlaianh.png',
    alt: 'Get Photo',
    note: '3. Dâu rể nhận ảnh xem trực tiếp!',
  },
  {
    src: '/assets/photobooth/trinhchieu.png',
    alt: 'Get Photo',
    note: '4. Có thể trình chiếu slide video ngay!',
  },
];

export function NavUpgrade({ sx, ...other }: StackProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{ mb: 4, textAlign: 'center', ...sx }}
        {...other}
      >
        <Typography
          variant="h6"
          sx={(theme) => ({
            ...textGradient(
              `to right, ${theme.vars.palette.primary.main}, ${theme.vars.palette.secondary.main}`
            ),
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.2,
          })}
        >
          Trải nghiệm PhotoBooth
        </Typography>
        <Typography sx={{fontSize: "10px", color: 'text.secondary', mt: 0.5, fontStyle: 'italic', maxWidth: 200, display: {xs: 'none', md: 'block'} }}>
          Ghi lại khoảnh khắc đáng nhớ trong ngày trọng đại!
        </Typography>

        <Box sx={{ width: 200, my: 2 }}>
          <AutoSlide images={processImages} />
        </Box>

        <Button
          onClick={handleOpenDialog} // Thay đổi từ href thành onClick
          variant="contained"
          sx={{
            background: `linear-gradient(45deg, #928362, #D2B48C)`,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          Khám phá ngay!
        </Button>
      </Box>

      {/* Component Dialog mới */}
      <PhotoBoothDialog open={isDialogOpen} onClose={handleCloseDialog} />
    </React.Fragment>
  );
}