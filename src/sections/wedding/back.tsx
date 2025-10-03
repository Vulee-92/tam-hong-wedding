/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';
import { styled, alpha } from '@mui/material/styles';
import { Box, Container, Typography, Grid } from '@mui/material';
import { weddingData } from './weddingData';

const giftColors = {
   primary: '#C62828', // Màu đỏ mận chủ đạo
  secondary: '#C49E66', // Vàng đồng
  background: '#faf9f5', // Nền trắng ngà ấm
  text: '#000',
  bg: '#FDFBF7',
};

// Change `styled('section')` to `styled(motion.section)`
const RootStyle = styled(motion.section)(({ theme }: any) => ({
  // backgroundImage: 'url("https://res.cloudinary.com/difiyurn7/image/upload/v1754986206/ChatGPT_Image_15_09_58_12_thg_8_2025_jjdwwo.png")',
  backgroundSize: 'cover',
  marginTop: 60,
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(12, 0),
  },
}));

const Card = styled(motion.div)(({ theme }: any) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(2),
  border: `1px solid ${alpha(giftColors.secondary, 0.3)}`,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
  },
}));

const FlexBox = styled(Grid)(({ theme }: any) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: "nowrap",
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

const QRWrapper = styled(Box)(({ theme }: any) => ({
  flexShrink: 0,
  width: '100%',
  maxWidth: 200,
  margin: '0 auto',
  [theme.breakpoints.up('sm')]: {
    marginRight: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3),
  },
}));

const QRImage = styled('img')({
  width: '70%',
  height: 'auto',
  borderRadius: '8px',
});

const AccountDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: "center",
  flexGrow: 1,
});

const RoleTitle = styled(Typography)(({ theme }: any) => ({
    fontFamily: "'Oooh Baby', serif !important",
  fontWeight: 500,
  fontSize: '1rem',
  color: giftColors.primary,
  marginBottom: theme.spacing(0.5),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    display: 'block',
    width: '60%',
    height: '1px',
    backgroundColor: giftColors.primary,
    margin: '4px auto 0',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 0,
    },
  },
}));

const OwnerName = styled(Typography)({
  fontFamily: "'SVN-GothamLight', serif !important",
  fontSize: '0.7rem',
  color: giftColors.text,
  fontWeight: 500,
  marginTop: '8px',
});

const AccountDetailsText = styled(Typography)({
  fontFamily: "'SVN-GothamLight', serif !important",
  fontSize: '0.5rem',
  color: giftColors.text,
  fontWeight: 400,
});

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MainTitle = styled(motion.div)(({ theme }: any) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  maxWidth: '450px',
  margin: '0 auto',
  '& .title-handwriting': {
    fontFamily: "'Oooh Baby', serif !important",
    fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
    color: "#C62828",
    fontWeight: 400,
  },
  '& .title-sans': {
    fontFamily: "'SVN-GothamLight', serif !important",
    fontSize: 'clamp(0.775rem, 6vw, 0.9rem)',
    color: '#000',
    fontWeight: 300,
    marginTop: theme.spacing(1),
  },
}));

const thankYouStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.8, delayChildren: 0.5 },
  },
};

const thankYouItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2 } },
};

export function WeddingGiftSection() {
  const thankYouText = [
    "Chúng con/Chúng tôi chân thành cảm ơn sự hiện diện",
    "và lời chúc phúc của quý vị.",
  ];

  return (
    // Apply animation props directly to RootStyle
    <RootStyle
      id="wedding-gift"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Container maxWidth="md">
        <MainTitle
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
        >
          <Typography className="title-handwriting">
            Gửi Trao Yêu Thương
          </Typography>
          {/* Ghi chú thêm cho khách mời */}
          <Typography className="title-sans">
            Chúng con/Chúng tôi xin chân thành cảm ơn và trân trọng tình cảm quý báu từ mọi người. 💝
          </Typography>
          <Box sx={{ width: '100%', mt: 4 }} />
        </MainTitle>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container spacing={2} justifyContent="center">
            {/* <Grid item xs={12} md={12}>
              <Card variants={itemVariants}>
                <FlexBox container>
                  <Grid item xs={12} sm={4}>
                    <QRWrapper>
                      <QRImage src="https://res.cloudinary.com/dxfsa7foy/image/upload/v1758699834/chure_v9ktae.png" alt="Mã QR Cô Dâu" />
                    </QRWrapper>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <AccountDetails>
                      <RoleTitle>CHÚ RỂ</RoleTitle>
                      <OwnerName>{weddingData.banksGroom.owner}</OwnerName>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                        <AccountDetailsText sx={{ mr: 1 }}>
                          {weddingData.banksGroom.bank} - {weddingData.banksGroom.account}
                        </AccountDetailsText>
                      </Box>
                    </AccountDetails>
                  </Grid>
                </FlexBox>
              </Card>
            </Grid> */}
            <Grid item xs={12} md={12}>
              <Card variants={itemVariants}>
                <FlexBox container>
                  <Grid item xs={12} sm={4}>
                    <QRWrapper>
                      <QRImage src="https://res.cloudinary.com/dq0fochj2/image/upload/v1759216370/codautam_semka8.png" alt="Mã QR Cô Dâu" />
                    </QRWrapper>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <AccountDetails>
                      <RoleTitle>Cô Dâu</RoleTitle>
                      <OwnerName>{weddingData.bankbride.owner}</OwnerName>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                        <AccountDetailsText sx={{ mr: 1 }}>
                          {weddingData.bankbride.bank} - {weddingData.bankbride.account}
                        </AccountDetailsText>
                      </Box>
                    </AccountDetails>
                  </Grid>
                </FlexBox>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        <MainTitle
          initial="hidden"
          whileInView="visible"
          variants={thankYouStagger}
          viewport={{ once: true, amount: 0.3 }}
          sx={{ pt: 5 }}
        >
          {thankYouText.map((line, index) => (
            <motion.div key={index} variants={thankYouItem}>
              <Typography className="title-sans" sx={{ fontSize: "13px !important" }}>
                {line}
              </Typography>
            </motion.div>
          ))}
        </MainTitle>
      </Container>
    </RootStyle>
  );
}