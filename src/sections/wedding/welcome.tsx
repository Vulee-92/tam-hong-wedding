/* eslint-disable */
import { motion, useAnimation } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Divider } from '@mui/material';
import { useState, useEffect, RefObject } from 'react';
import { weddingData } from './weddingData';

// --- Palettes & Fonts ---
const COLORS = {
  primary: '#C62828', // Màu đỏ mận chủ đạo
  secondary: '#C49E66', // Vàng đồng
  background: '#faf9f5', // Nền trắng ngà ấm
  text: '#000',
};
// const goldGradient = 'linear-gradient(100deg, #f3eac2, #e49e2dff, #f3eac2)';

const goldGradient = `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.primary}, ${COLORS.secondary})`;

// --- Styled Components ---
const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: COLORS.background,
  // backgroundImage: 'url("https://res.cloudinary.com/difiyurn7/image/upload/v1754985415/backgroundlightflower_yyhwy4.png")',
  backgroundSize: 'cover',
  overflow: 'hidden',
  position: 'relative',
  paddingTop: '80px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
    paddingTop: '60px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("https://res.cloudinary.com/difiyurn7/image/upload/v1754986507/hoa_lyfgnc.png")',
    backgroundSize: '400px',
    opacity: 0.05,
    zIndex: 1,
  },
}));

const InvitationCard = styled(motion.div)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  maxHeight: '90vh',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
  // padding: theme.spacing(4, 2),
  borderRadius: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 4),
  },
}));

const SectionWrapper = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  width: '100%',
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'SVN-GothamLight'', serif",

  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
  color: COLORS.text,
  marginBottom: theme.spacing(1),
  letterSpacing: '0.1em',
}));

const FamilyInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  position: 'relative',
  // '&::after': {
  //   content: '""',
  //   position: 'absolute',
  //   top: '10%',
  //   left: '50%',
  //   height: '80%',
  //   width: 1,
  //   background: 'rgba(0,0,0,0.08)',
  // },
}));

const ParentSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1),
  '& .title': {
    fontFamily: "'SVN-GothamLight', serif !important",  // thêm !important ở đây
    fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
    color: `${COLORS.text} !important`, // nếu cần override color
    fontWeight: 500,
  },
  '& .titlelocation': {
    fontFamily: "'SVN-GothamLightItalic', serif !important",  // thêm !important ở đây
    fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
    color: `${COLORS.text} !important`, // nếu cần override color
    fontWeight: 500,
  },
  
  '& .name': {
    fontFamily: "'SVN-GothamLight', serif !important",
    fontSize: 'clamp(0.75rem, 1.8vw, 0.95rem)',
    color: `${COLORS.text} !important`,
    fontWeight: 600,

  },
}));


const AnnouncementTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'SVN-GothamLight', serif !important",
  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
  color: COLORS.text,
  letterSpacing: '0.01em',
  marginBottom: theme.spacing(1),
}));

const CoupleNames = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  '& .name': {
    fontFamily: "'Oooh Baby', cursive",
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    // lineHeight: 1.2,
    background: goldGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 4px rgba(0,0,0,0.03)',
    backgroundSize: '200% auto',
    animation: 'shine 4s linear infinite',
    '@keyframes shine': {
      to: {
        backgroundPosition: '200% center',
      },
    },
  },
  '& .divider-text': {
    fontFamily: "'TPLeMajor', serif !important",
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: COLORS.primary,
    margin: theme.spacing(1, 0),
  },
}));

const CeremonyDetails = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  // marginTop: theme.spacing(4),
  '& .info-label': {
    fontFamily: "'SVN-GothamLight', serif !important",

    fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
    color: COLORS.text,
    marginBottom: theme.spacing(1),
  },
  '& .info-value': {
 fontFamily: "'SVN-GothamLight', serif !important",
    fontSize: 'clamp(1.3rem, 2.2vw, 1.2rem)',
    color: COLORS.text,
        textTransform: 'uppercase',
    fontWeight: 500,
  },
  '& .lunar-date': {
    fontFamily: "'SVN-GothamLight', serif !important",

    fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
    color: '#000',
    fontStyle: 'italic',
  },
}));

const TimeDateWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(2, 0),
}));

const TimeDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '70%',
  margin: theme.spacing(1, 0),
  '&::before, &::after': {
    content: '""',
    flexGrow: 1,
    height: '1px',
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
}));

const HyOrnament = styled('img')(({ theme }) => ({
  width: '25px',
  height: '25px',
  margin: theme.spacing(0, 1),
}));

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export function WelcomeSection({ detailsRef }: { detailsRef: RefObject<HTMLDivElement> }) {
  const [showContent, setShowContent] = useState(false);
  const event = weddingData.events[0];

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    if (detailsRef.current && scrollPosition > detailsRef.current.offsetTop) {
      setShowContent(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <RootStyle ref={detailsRef}>
      <Container maxWidth="md">
        <InvitationCard
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.3 }
            },
            hidden: {
              transition: { staggerChildren: 0.1, staggerDirection: -1 }
            }
          }}
        >
          {/* Section: Family Info */}
          <SectionWrapper variants={itemVariants}>
            <FamilyInfo>
              <ParentSection>
                <Typography className="title">Gia đình Nhà Gái</Typography>
                <Typography className="name">Ông {weddingData.bride.father}</Typography>
                <Typography className="name">Bà {weddingData.bride.mother}</Typography>
                <Typography className="titlelocation">Hiệp Hoà - Bắc Ninh</Typography>

              </ParentSection>
              <ParentSection>
                <Typography className="title">Gia đình Nhà Trai</Typography>
                <Typography className="name">Ông {weddingData.groom.father}</Typography>
                <Typography className="name">Bà {weddingData.groom.mother}</Typography>
                <Typography className="titlelocation">Phường Nếnh - Bắc Ninh</Typography>

              </ParentSection>
            </FamilyInfo>
          </SectionWrapper>

          {/* Section: Announcement & Couple Names */}
          <SectionWrapper variants={itemVariants}>
            <AnnouncementTitle>            TRÂN TRỌNG BÁO TIN
            </AnnouncementTitle>
            <AnnouncementTitle><b>LỄ THÀNH HÔN</b> CỦA CHÚNG TÔI</AnnouncementTitle>
            <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
            <CoupleNames>
              <Typography className="name">{weddingData.groom.name}</Typography>

              <Typography sx={{
                fontFamily: "'SVN-GothamLight', serif !important",
                fontSize: '0.75rem', color: COLORS.text
              }}>
                {/* Út Nữ */}
              </Typography>
              <Typography className="divider-text">&</Typography>
                                     <Typography className="name">{weddingData.bride.name}</Typography>


              <Typography sx={{
                fontFamily: "'SVN-GothamLight', serif !important",
                fontSize: '0.75rem', color: COLORS.text
              }}>
                {/* Út Nam  */}
              </Typography>
            </CoupleNames>
            <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
          </SectionWrapper>

          {/* Section: Ceremony Details (Updated) */}
          <SectionWrapper variants={itemVariants}>
            <CeremonyDetails>
              <Typography
                className="info-label"
                sx={{
                  display: 'inline-block',
                  mb: 2,
                }}
              >
                HÔN LỄ ĐƯỢC CỬ HÀNH TẠI
              </Typography>
              {/* <Typography className="info-value">
                TƯ GIA NAM
              </Typography> */}
              <Typography className="info-value">
                {/* {event.location} */}
             Tư gia nhà trai
              </Typography>

              <TimeDateWrapper>
                <Typography sx={{
                  fontFamily: "'TPLeMajor', serif !important",

                  fontSize: 'clamp(1.7rem, 2.5vw, 1.7rem)', fontWeight: 600, color: COLORS.primary
                }}>
                  13:00
                </Typography>
                <TimeDivider>
                  <Typography
                    sx={{
                      fontFamily: "'china'",
                      display: 'inline-block',
                      color: "#C62828",
                      mx: 2,
                      fontSize: 20
                    }}
                  >
                    囍
                  </Typography>
                </TimeDivider>
                <Typography sx={{
                  fontFamily: "'TPLeMajor', serif !important",

                  fontSize: 'clamp(1.8rem, 2.5vw, 1.8rem)', fontWeight: 600, color: COLORS.primary, mt: 1
                }}>
                  {/* {event.date} */} 12 . 10 . 2025
                </Typography>
              </TimeDateWrapper>

              <Typography sx={{
                fontFamily: "'SVN-GothamLightItalic', serif !important",
                fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)', color: '#000'
              }}>
                (Nhằm ngày 21 tháng 08 năm Ất Tỵ)
              </Typography>
            </CeremonyDetails>
          </SectionWrapper>

        </InvitationCard>
      </Container>
    </RootStyle>
  );
}