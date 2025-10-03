import React from 'react';
import { Box, Typography, Button, Tooltip, Stack, useTheme, keyframes } from '@mui/material';
import { motion } from 'framer-motion';

interface PhotoBoothAdProps {
    onSkipClick: () => void;
}

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const QR_CODE_IMAGE_URL = '/assets/photobooth/qrcode_link.png';

const PhotoBoothAd: React.FC<PhotoBoothAdProps> = ({ onSkipClick }) => {
    const theme = useTheme();

    const handleZaloClick = () => {
        window.open('https://zalo.me/0986320932', '_blank');
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: theme.spacing(4),
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #fad0c4 50%, #ffd1ff 100%)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
            }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <Typography variant="h4" sx={{ color: '#880E4F', fontFamily: "'Oooh Baby', serif", mb: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                    Lưu giữ mọi khoảnh khắc, không bỏ lỡ tấm ảnh nào!
                </Typography>
                <Typography variant="body1" sx={{ color: '#4A148C', fontStyle: 'italic', maxWidth: 500, mx: 'auto', fontSize: { xs: '1rem', sm: '1.1rem' }, mt: 2 }}>
                    Sau tiệc cưới, bạn thường phải chờ đợi hoặc khó khăn khi xin ảnh từ bạn bè, người thân.
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', sm: '1.1rem' }, mt: 3, fontWeight: 'bold' }}>
                    Với dịch vụ Photo Booth, khách mời chỉ cần quét mã QR tại bàn, chụp ảnh selfie hoặc ảnh nhóm và gửi trực tiếp đến cho dâu rể.
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', sm: '1.1rem' }, mt: 2 }}>
                    Hình ảnh sẽ tự động được thêm vào album này và có thể trình chiếu trực tiếp trên màn hình LED ngay tại tiệc cưới.
                </Typography>
                <Box sx={{ position: 'relative', my: 4, display: 'inline-block' }}>
                    <img src={QR_CODE_IMAGE_URL} alt="QR Code Photo Booth" style={{ width: '300px', height: '180px', borderRadius: '8px' }} />
                    <Tooltip
                        open
                        title="Quét ngay!"
                        placement="right"
                        arrow
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '100%',
                            transform: 'translateY(-50%)',
                            animation: `${bounce} 2s infinite`,
                            '& .MuiTooltip-tooltip': { bgcolor: '#FF69B4', color: 'white', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', padding: theme.spacing(1, 2) },
                            '& .MuiTooltip-arrow': { color: '#FF69B4' }
                        }}
                    >
                        <span style={{ display: "inline-block", width: 1, height: 1 }} />
                    </Tooltip>
                </Box>
                <Typography variant="h6" sx={{ color: '#000', fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: '1.1rem', sm: '1.3rem' }, mt: 1, mb: 1 }}>
                    Quét mã QR và chụp ảnh ngay!
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic', fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 3 }}>
                    (Ảnh của bạn sẽ hiển thị trong Slideshow Demo!)
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Button variant="contained" sx={{ bgcolor: '#FF69B4', '&:hover': { bgcolor: '#FF4D94' }, fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: '0.9rem', sm: '1rem' }, py: { xs: 1, sm: 1.5 }, px: { xs: 3, sm: 4 } }} onClick={handleZaloClick}>
                        Liên hệ Zalo: 0986.320.932
                    </Button>
                    <Button variant="outlined" sx={{ color: '#FF69B4', borderColor: '#FF69B4', '&:hover': { borderColor: '#FF4D94', bgcolor: 'rgba(255, 105, 180, 0.08)' }, fontFamily: "'Cormorant Garamond', serif", fontSize: { xs: '0.9rem', sm: '1rem' }, py: { xs: 1, sm: 1.5 }, px: { xs: 3, sm: 4 } }} onClick={onSkipClick}>
                        Bỏ qua & Xem Album Cưới
                    </Button>
                </Stack>
            </motion.div>
        </Box>
    );
};

export default PhotoBoothAd;