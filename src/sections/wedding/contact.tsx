import { useState } from 'react';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Stack, 
  IconButton, 
  TextField, 
  Button, 
  Snackbar, 
  Alert,
  Divider,
  Tooltip,
  Dialog,
  DialogContent,
} from '@mui/material';
import { ENDPOINTS, HOST_API } from 'src/config-global';
import { Iconify } from 'src/components/iconify';
import { weddingStyles } from './styles';

const RootStyle = styled('div')(({ theme }) => ({
  ...weddingStyles.components.section(theme),
  background: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('/assets/images/wedding/flower-bg-2.jpg')`,
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: `url('/assets/images/wedding/heart-pattern.png')`,
    opacity: 0.05,
    pointerEvents: 'none',
  }
}));

const ContactCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.98)',
  borderRadius: theme.spacing(4),
  padding: theme.spacing(6),
  boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
  border: `1px solid ${weddingStyles.colors.secondary}`,
  height: '100%',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(45deg, ${weddingStyles.colors.primary}, ${weddingStyles.colors.accent})`,
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    border: `1px solid ${weddingStyles.colors.primary}`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: 'rgba(255,255,255,0.8)',
    border: `1px solid ${weddingStyles.colors.secondary}`,
    transition: 'all 0.3s ease',
    padding: theme.spacing(0.5, 1),
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: weddingStyles.colors.primary,
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: weddingStyles.colors.primary,
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    },
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      padding: theme.spacing(1.5, 1),
      fontSize: '1rem',
      '&::placeholder': {
        color: weddingStyles.colors.text,
        opacity: 0.5,
      },
    },
    '& textarea': {
      padding: theme.spacing(1.5, 1),
      fontSize: '1rem',
      '&::placeholder': {
        color: weddingStyles.colors.text,
        opacity: 0.5,
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: weddingStyles.colors.text,
    opacity: 0.7,
    fontSize: '0.95rem',
    transform: 'translate(14px, -8px) scale(0.9)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '0 8px',
    '&.Mui-focused': {
      color: weddingStyles.colors.primary,
    },
    '&.MuiFormLabel-filled': {
      transform: 'translate(14px, -8px) scale(0.9)',
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiInputAdornment-root': {
    marginTop: '0 !important',
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.8, 4),
  fontSize: '1.1rem',
  textTransform: 'none',
  fontFamily: "'Playfair Display', serif",
  background: `linear-gradient(45deg, ${weddingStyles.colors.primary}, ${weddingStyles.colors.accent})`,
  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
    background: `linear-gradient(45deg, ${weddingStyles.colors.accent}, ${weddingStyles.colors.primary})`,
  },
  '&.Mui-disabled': {
    background: `linear-gradient(45deg, ${weddingStyles.colors.secondary}, #e0e0e0)`,
    opacity: 0.7,
  },
  '& .MuiButton-endIcon': {
    marginLeft: theme.spacing(1),
    '& svg': {
      fontSize: '1.2rem',
      transition: 'transform 0.3s ease',
    },
  },
  '&:hover .MuiButton-endIcon svg': {
    transform: 'translateX(4px)',
  },
}));

const HeartIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '300px',
  height: '300px',
  right: '-150px',
  bottom: '-150px',
  background: `linear-gradient(45deg, ${weddingStyles.colors.primary}10, ${weddingStyles.colors.accent}10)`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '32px',
    color: weddingStyles.colors.primary,
    opacity: 0.2,
  },
}));

const BankInfoCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.98)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  border: `1px solid ${weddingStyles.colors.secondary}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: weddingStyles.colors.primary,
    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  },
}));

const BankItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: 'rgba(255,255,255,0.9)',
  border: `1px solid ${weddingStyles.colors.secondary}`,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255,255,255,1)',
    borderColor: weddingStyles.colors.primary,
    transform: 'translateY(-2px)',
  },
}));

const CopyButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5, 2),
  fontSize: '0.875rem',
  color: weddingStyles.colors.primary,
  borderColor: weddingStyles.colors.primary,
  '&:hover': {
    borderColor: weddingStyles.colors.accent,
    backgroundColor: 'rgba(158,138,120,0.05)',
  },
}));

const ThankYouDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(3),
    padding: 0,
    maxWidth: 600,
    width: '95%',
    background: 'none',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  '& .MuiDialogContent-root': {
    padding: 0,
    position: 'relative',
    minHeight: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url('/assets/images/wedding/vh13.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(0.9)',
      zIndex: 0,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 100%)',
      zIndex: 1,
    },
  },
}));

const ThankYouContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(6),
  textAlign: 'center',
  margin: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: `2px solid ${weddingStyles.colors.primary}20`,
    borderRadius: theme.spacing(2),
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    border: `1px solid ${weddingStyles.colors.primary}30`,
    borderRadius: theme.spacing(1),
    zIndex: -1,
  },
}));

const DialogImage = styled('img')({
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderRadius: 16,
  marginBottom: 24,
});

type CornerPosition = 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

const CornerDecoration = styled(Box)(({ theme, cornerPosition }: { theme?: any; cornerPosition: CornerPosition }) => ({
  position: 'absolute',
  width: 40,
  height: 40,
  ...(cornerPosition === 'topleft' && { top: 0, left: 0, transform: 'rotate(0deg)' }),
  ...(cornerPosition === 'topright' && { top: 0, right: 0, transform: 'rotate(90deg)' }),
  ...(cornerPosition === 'bottomleft' && { bottom: 0, left: 0, transform: 'rotate(270deg)' }),
  ...(cornerPosition === 'bottomright' && { bottom: 0, right: 0, transform: 'rotate(180deg)' }),
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0C0 20 20 40 40 40V38C21 38 2 19 2 0H0Z' fill='${encodeURIComponent(weddingStyles.colors.primary)}20'/%3E%3C/svg%3E")`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
}));

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [openThankYou, setOpenThankYou] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [copiedText, setCopiedText] = useState('');

  const handleSubmitWish = async () => {
    if (!name || !content) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền tên và lời chúc',
        severity: 'error',
      });
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setSnackbar({
          open: true,
          message: 'Email không hợp lệ',
          severity: 'error',
        });
        return;
      }
    }

    setLoading(true);
    try {
      let deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('device_id', deviceId);
      }

      // Send to Google Sheets
      const sheetResponse = await fetch('', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email: email || 'Không có',
          content,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!sheetResponse.ok) {
        throw new Error('Không thể gửi đến Google Sheets');
      }

      setSubmittedName(name);
      setOpenThankYou(true);
      
      setName('');
      setEmail('');
      setContent('');

    } catch (error: any) {
      console.error('Wish Submit Error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseThankYou = () => {
    setOpenThankYou(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                ...weddingStyles.typography.h2,
                mb: 2,
                background: `linear-gradient(45deg, ${weddingStyles.colors.text}, ${weddingStyles.colors.primary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gửi Lời Chúc
            </Typography>
            <Typography
              sx={{
                color: weddingStyles.colors.text,
                opacity: 0.8,
                maxWidth: 600,
                mx: 'auto',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Hãy gửi những lời chúc tốt đẹp nhất đến đôi uyên ương
            </Typography>
          </motion.div>
        </Box>

        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ContactCard>
                <Stack spacing={4}>
                  <StyledTextField
                    fullWidth
                    label="Tên của bạn"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: weddingStyles.colors.primary }}>
                          <Iconify icon="mdi:account-heart" />
                        </Box>
                      ),
                    }}
                  />
                  <StyledTextField
                    fullWidth
                    label="Email (không bắt buộc)"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, color: weddingStyles.colors.primary }}>
                          <Iconify icon="mdi:email-heart" />
                        </Box>
                      ),
                    }}
                  />
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Lời chúc của bạn"
                    variant="outlined"
                    placeholder="Gửi những lời chúc tốt đẹp nhất đến cô dâu chú rể..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, mt: 1, color: weddingStyles.colors.primary }}>
                          <Iconify icon="mdi:card-heart" />
                        </Box>
                      ),
                    }}
                  />
                  <SendButton 
                    variant="contained" 
                    fullWidth
                    disabled={loading || !name || !content}
                    onClick={handleSubmitWish}
                    endIcon={<Iconify icon="mdi:send-heart" />}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi Lời Chúc'}
                  </SendButton>
                </Stack>
                <HeartIcon>
                  <Iconify icon="mdi:cards-heart" />
                </HeartIcon>
              </ContactCard>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" sx={{ mt: 8 }}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <BankInfoCard>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    color: weddingStyles.colors.text,
                    mb: 3,
                  }}
                >
                  Thông Tin Chuyển Khoản
                </Typography>

                <Stack spacing={3}>
                  <BankItem>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ minWidth: 40 }}>
                        <Iconify 
                          icon="mingcute:bank-card-fill" 
                          sx={{ 
                            color: weddingStyles.colors.primary,
                            fontSize: 24,
                          }} 
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: weddingStyles.colors.text }}>
                          Chú Rể - Lê Bùi Thanh Vũ
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: weddingStyles.colors.text,
                            opacity: 0.8,
                            mt: 0.5,
                          }}
                        >
                          Vietcombank : 9986320932 
                        </Typography>
                      </Box>
                      <CopyButton
                        variant="outlined"
                        size="small"
                        onClick={() => handleCopyText('9986320932')}
                      >
                        {copiedText === '9986320932' ? 'Đã sao chép' : 'Sao chép'}
                      </CopyButton>
                    </Stack>
                  </BankItem>

                  <BankItem>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ minWidth: 40 }}>
                        <Iconify 
                          icon="mingcute:bank-card-fill" 
                          sx={{ 
                            color: weddingStyles.colors.primary,
                            fontSize: 24,
                          }} 
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: weddingStyles.colors.text }}>
                          Cô Dâu - Võ Thị Bảo Hân
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: weddingStyles.colors.text,
                            opacity: 0.8,
                            mt: 0.5,
                          }}
                        >
                          Vietcombank: 1846028398 
                        </Typography>
                      </Box>
                      <CopyButton
                        variant="outlined"
                        size="small"
                        onClick={() => handleCopyText('1846028398')}
                      >
                        {copiedText === '1846028398' ? 'Đã sao chép' : 'Sao chép'}
                      </CopyButton>
                    </Stack>
                  </BankItem>

                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      color: weddingStyles.colors.text,
                      opacity: 0.7,
                      fontStyle: 'italic',
                    }}
                  >
                    Nội dung chuyển khoản: [Tên của bạn] chuc mung Vu-Han
                  </Typography>
                </Stack>
              </BankInfoCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <ThankYouDialog
        open={openThankYou}
        onClose={handleCloseThankYou}
        aria-labelledby="thank-you-dialog"
      >
        <DialogContent>
          <ThankYouContent>
            <CornerDecoration cornerPosition="topleft" />
            <CornerDecoration cornerPosition="topright" />
            <CornerDecoration cornerPosition="bottomleft" />
            <CornerDecoration cornerPosition="bottomright" />
            
            <HeartIcon>
              <Iconify icon="mdi:cards-heart" />
            </HeartIcon>
            
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Playfair Display', serif",
                color: weddingStyles.colors.primary,
                mb: 1,
                mt: 3,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'relative',
                display: 'inline-block',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  width: { xs: 40, sm: 60 },
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${weddingStyles.colors.primary}40)`,
                  top: '50%',
                },
                '&::before': {
                  right: '100%',
                  marginRight: 2,
                },
                '&::after': {
                  left: '100%',
                  marginLeft: 2,
                  transform: 'rotate(180deg)',
                },
              }}
            >
              Cảm ơn
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                color: weddingStyles.colors.text,
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                fontWeight: 500,
                fontStyle: 'italic',
              }}
            >
              {submittedName}
            </Typography>

            <Stack spacing={2.5} sx={{ maxWidth: 450, mx: 'auto', mb: 4 }}>
              <Typography
                sx={{
                  color: weddingStyles.colors.text,
                  opacity: 0.9,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Cảm ơn bạn đã dành những lời chúc tốt đẹp và ý nghĩa đến chúng mình. 
                Mỗi lời chúc là một món quà tinh thần quý giá mà chúng mình sẽ luôn trân trọng và ghi nhớ.
              </Typography>

              {email && (
                <Typography
                  sx={{
                    color: weddingStyles.colors.primary,
                    opacity: 0.9,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontFamily: "'Montserrat', sans-serif",
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    background: 'rgba(158,138,120,0.05)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `1px dashed ${weddingStyles.colors.primary}30`,
                  }}
                >
                  <Iconify icon="mdi:email-check" />
                  Chúng mình đã gửi email cảm ơn đến địa chỉ {email} để bạn lưu giữ lại kỷ niệm này
                </Typography>
              )}

              <Typography
                sx={{
                  color: weddingStyles.colors.text,
                  opacity: 0.9,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontFamily: "'Montserrat', sans-serif",
                  position: 'relative',
                  textAlign: 'center',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 120,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${weddingStyles.colors.primary}30, transparent)`,
                  },
                }}
              >
                Hẹn gặp bạn trong ngày vui trọng đại của chúng mình nhé! 💝
              </Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={handleCloseThankYou}
              sx={{
                borderRadius: 6,
                px: 4,
                py: 1,
                background: `linear-gradient(45deg, ${weddingStyles.colors.primary}, ${weddingStyles.colors.accent})`,
                color: '#fff',
                fontSize: '1rem',
                textTransform: 'none',
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: '0 4px 15px rgba(158,138,120,0.3)',
                border: 'none',
                '&:hover': {
                  background: `linear-gradient(45deg, ${weddingStyles.colors.accent}, ${weddingStyles.colors.primary})`,
                  boxShadow: '0 6px 20px rgba(158,138,120,0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Đóng
            </Button>
          </ThankYouContent>
        </DialogContent>
      </ThankYouDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </RootStyle>
  );
} 