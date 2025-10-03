/* eslint-disable */
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid} from '@mui/material';
import { motion } from 'framer-motion';
import { weddingStyles } from './styles'; // Giữ nguyên
import { weddingData } from './weddingData'; // Giữ nguyên

const RootStyle = styled('div')(({ theme }) => ({
  ...weddingStyles.components.section(theme),
  // backgroundImage: 'url("https://res.cloudinary.com/difiyurn7/image/upload/v1754986206/ChatGPT_Image_15_09_58_12_thg_8_2025_jjdwwo.png")',
  // backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  padding: theme.spacing(10, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
     background: 'linear-gradient(to top, rgba(251,250,248,0.09), rgba(255,255,255,0.1), rgba(251,250,248,0.3))',
    // backdropFilter: 'blur(3px)',
    pointerEvents: 'none',
  },
}));

const CountdownTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Oooh Baby', cursive",
  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
  color: '#2D3436',
  letterSpacing: '0.02em',
  fontWeight: 500,
  marginBottom: theme.spacing(8),
  textAlign: 'center',
  position: 'relative',
  '& .accent': {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: '#000',
    fontWeight: 500,
    display: 'block',
    marginTop: theme.spacing(1),
    letterSpacing: '0.01em',
    opacity: 0.85
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -25,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 1,
  },
}));

const TimeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: theme.spacing(2.5),
  width: '100%',
  maxWidth: 160,
  aspectRatio: '1',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    maxWidth: 100,
  }
}));

const TimeNumber = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  color: '#34495e',
  fontWeight: 500,
  lineHeight: 1.1,
  marginBottom: theme.spacing(0.5),
  textShadow: '0 2px 6px rgba(0,0,0,0.03)',
}));

const TimeLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'Oooh Baby', cursive",
  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
  color: '#000',
  letterSpacing: '0.12em',
  fontWeight: 400,
  opacity: 0.9,
  textTransform: 'lowercase',
}));

const MainTitle = styled(motion.div)(({ theme }: any) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  maxWidth: '450px',
  margin: '0 auto',
  '& .title-handwriting': {
    fontFamily: "'Oooh Baby', serif !important",
    fontSize: 'clamp(1.75rem, 5vw, 3rem)',
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

const itemVariants = {
  hidden: { opacity: 1, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const Divider = styled(motion.div)({
  width: '60px',
  height: '1px',
  backgroundColor: '#000',
  margin: '0 auto 40px',
});

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const { year, month, day } = weddingData.weddingDateDetails;
    // Thêm giờ và phút vào đối tượng Date để đếm ngược chính xác
    const weddingDate = new Date(year, month - 1, day, 9, 0, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <MainTitle variants={itemVariants}>
            <Typography className="title-handwriting">
              Đếm Ngược
            </Typography>
            <Typography className="title-sans">
              Đến ngày vui
            </Typography>
          </MainTitle>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              maxWidth: 900,
              gap: { xs: 2, sm: 3, md: 5 },
              margin: '0 auto',
              px: { xs: 1, md: 0 }
            }}
          >
            {Object.entries(timeLeft).map(([label, value], index) => (
              <Grid item key={label}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: index * 0.2, ease: "easeOut" },
                    },
                    hidden: { opacity: 0, y: 30 },
                  }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                    <TimeBox>
                      <TimeNumber>{value}</TimeNumber>
                      <TimeLabel>
                        {label === 'days' && 'Ngày'}
                        {label === 'hours' && 'Giờ'}
                        {label === 'minutes' && 'Phút'}
                        {label === 'seconds' && 'Giây'}
                      </TimeLabel>
                    </TimeBox>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </RootStyle>
  );
}
