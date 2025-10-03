import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';

const goldGradient = 'linear-gradient(100deg, #f3eac2, #e49e2dff, #f3eac2)';

// Styled Components
const RootStyle = styled('div')(({ theme }) => ({
  height: '100vh',
  width: "100%",
  display: 'flex',
  backgroundImage: `url('https://res.cloudinary.com/dq0fochj2/image/upload/v1759212504/h22_a1jvhc.jpg')`,
  backgroundSize: 'cover',

  maxWidth: '600px', margin: '0 auto', overflowX: 'hidden',

  backgroundPosition: 'center center',   // 👈 quan trọng
  backgroundRepeat: 'no-repeat',         // 👈 tránh lặp
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(255,255,255,0.1), rgba(255,255,255,0.1), rgba(255,255,255,0.1))',
    zIndex: 1,
    backdropFilter: 'blur(2px)',
  },
}));


const BackgroundNumbers = styled(motion.div)(() => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  textAlign: 'center',
    fontFamily: "'TPLeMajor', serif !important",

  '& .number': {
    fontSize: 'clamp(200px, 25vw, 400px)',
     fontFamily: "'TPLeMajor', serif !important",

    fontWeight: 300,
    color: '#C62828',
    lineHeight: 0.8,
  },
}));

const Bubble = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: 'clamp(10px, 1vw, 20px)',
  height: 'clamp(10px, 1vw, 20px)',
  backgroundColor: '#f8d0e0',
  borderRadius: '50%',
}));

const NameStyle = styled(motion.h1)(() => ({
    fontFamily: "'Oooh Baby', serif !important",

  fontSize: 'clamp(100px, 15vw, 120px)',
  fontWeight: 400,
  color: '#C62828',
  opacity: 0.7,
  margin: 0,
  background: goldGradient,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'shine 4s linear infinite',
  '@keyframes shine': {
    to: {
      backgroundPosition: '200% center',
    },
  },
}));
const WaveTransition = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: -2,
  left: 0,
  width: '100%',
  height: '50px',
  zIndex: 2,
  overflow: 'hidden',
  '& svg': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fill: theme.palette.background.paper,
  },
}));
const AndSign = styled(motion.p)(() => ({
  fontFamily: 'Playfair Display, serif',
  fontSize: 'clamp(80px, 10vw, 120px)',
  color: '#C62828',
  marginBottom: '1rem',
  marginTop: '1rem',

}));

// Variants for animations
const heartBeatVariants = {
  initial: { opacity: 0.08, scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 0.3, 0.7],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const waveEffectVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: [50, -30, 0], // Hiệu ứng sóng biển nhẹ nhàng
    transition: {
      duration: 1.2,
      delay: i * 0.2,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export function EventSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <RootStyle>
      {/* Background Numbers with Heartbeat Effect */}
       <WaveTransition>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,122.7C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </WaveTransition>
      <BackgroundNumbers
        variants={heartBeatVariants}
        initial="initial"
        animate="pulse"
      >
        <div className="number">12</div>
        <div className="number">10</div>
        <div className="number">25</div>
      </BackgroundNumbers>

      {/* Floating Bubbles */}
      <Bubble custom={0} animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} sx={{ top: '20%', left: '10%', opacity: 0.2 }} />
      <Bubble custom={1} animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} sx={{ top: '32%', right: '16%', opacity: 0.15 }} />
      <Bubble custom={2} animate={{ y: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} sx={{ bottom: '32%', left: '20%', opacity: 0.2 }} />
      <Bubble custom={3} animate={{ y: [0, -20, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} sx={{ bottom: '40%', right: '24%', opacity: 0.15 }} />

      {/* Couple Names - Foreground with Wave Effect */}
      <Box ref={ref} sx={{ textAlign: 'center', zIndex: 10, p: 2 }}>
        <NameStyle
          variants={waveEffectVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0} // Dành cho "Ân"
        >
           Tâm
        </NameStyle>

        {/* <AndSign
          variants={waveEffectVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1} // Dành cho "&"
        >
          &
        </AndSign> */}

        <NameStyle
          variants={waveEffectVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={2} // Dành cho "Hạ"
        >
          Hồng
        </NameStyle>
         <WaveTransition>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,122.7C840,107,960,85,1080,90.7C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
      </WaveTransition>
      </Box>

      {/* Scroll Indicator */}
      {/* <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: '1rem', zIndex: 10 }}
      >
        <ChevronDown style={{ width: '24px', height: '24px', color: '#ccc' }} />
      </motion.div> */}
    </RootStyle>
  );
}