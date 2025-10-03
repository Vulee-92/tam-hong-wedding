

/* eslint-disable */
import { useRef, useState, useEffect } from 'react';
import { Typography, Button, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { WeddingLayout } from './layout';
import { CoverSection } from './cover';
import { WelcomeSection } from './welcome';
import { GallerySection } from './gallery';
import { CountdownSection } from './countdown';
import { EventDetailsSection } from './event-details';
import { RsvpSection } from './rsvp';
import { WeddingGiftSection } from './back';
import { BibleSection } from './bible';
import { EventSection } from './dayevent';
import { useAudio } from 'src/context/AudioContext';
import { MusicPlayer } from './music-player';
import { CoverBottomSection } from './coverbottom';
import { weddingData } from './weddingData';

const backgroundImages = [
  'https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212503/h21_xq2mnz.jpg',
  'https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759416852/mainnn_v061ye.jpg',
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212506/h29_iaqvdn.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212506/h19_vslpgx.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212505/h28_tkxxgs.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212505/h27_ksm6wj.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212505/h25_kyvqzd.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212505/h26_wykddj.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212504/h24_cwk4ji.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212504/h23_eg6fxp.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212504/h22_a1jvhc.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212504/h20_ukgbea.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212503/h21_xq2mnz.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212502/h14_ho6eww.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212502/h13_bk7gcc.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212501/h9_rpvvph.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212501/h5_pp3os8.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759296146/codau_r3psnb.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759296144/chure_mgmfhm.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212501/h10_buoyak.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212500/h8_hivezb.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212500/h6_y9cjbz.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212500/h12_eisomm.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212499/h4_tiaxbt.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212499/h18_auo14g.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212499/h7_f0igpk.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212499/h16_j9hjwl.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212498/h3_wnspke.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212498/h_js6pmj.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212498/h1_at7tfu.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212498/h11_pldbea.jpg",
"https://res.cloudinary.com/dq0fochj2/image/upload/f_auto,q_auto,w_1200/v1759212498/h17_tkbnck.jpg"
];

const MusicContainer = styled(motion.div)(() => ({
  height: '100vh',
  width: "100%",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  maxWidth: '600px', margin: '0 auto', overflowX: 'hidden',
  overflow: 'hidden',

  // pseudo-element cho background
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('https://res.cloudinary.com/dq0fochj2/image/upload/v1759212503/h21_xq2mnz.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(`px)',   // 👈 mờ nền
    transform: 'scale(1)', // 👈 tránh viền đen khi blur
    zIndex: 0,
  },
}));

const MusicContent = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5, 3),
  width: '100%',
  maxWidth: 370,
  margin: "0px 10px",
  position: 'relative',  // để nổi trên ::before
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(1px)',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));





const MusicButtonGroup = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const MotionButtonGroup = motion(MusicButtonGroup);

export default function WeddingView() {
  const detailsRef = useRef<HTMLDivElement>(null);
  const [showMusicDialog, setShowMusicDialog] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { play, pause } = useAudio();

  useEffect(() => {
    // preload background images
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleMusicChoice = async (choice: boolean) => {
    setIsTransitioning(true);

    if (choice) {
      await play();
    } else {
      pause();
    }

    setTimeout(() => {
      setShowMusicDialog(false);
    }, 500);
  };

  if (showMusicDialog) {
    return (
      <Box sx={{ width: '100vw', height: '100vh', overflowX: 'hidden' }}>
        <MusicContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        >
          <MusicContent>
            <Typography sx={{
              color: '#fff',
               fontFamily: "'Oooh Baby', serif !important",
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 500,
              letterSpacing: '0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              Thêm chút nhạc?
            </Typography>
            <Typography sx={{
              color: '#fff',
              fontSize: { xs: '1rem', sm: '1rem' },
            fontFamily: "'SVN-GothamLight', serif !important",
              letterSpacing: '0.03em',
            }}>
              Một bản nhạc đặc biệt <br /> cho khoảnh khắc đặc biệt
            </Typography>
            <MotionButtonGroup direction="row"
              spacing={7}
              justifyContent="center"
              animate={isTransitioning ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}>
              <Button onClick={() => handleMusicChoice(false)} disabled={isTransitioning}
                sx={{
                  color: '#fff',
                  fontFamily: "'Oooh Baby', serif !important",
                  fontSize: { xs: '1.5rem', sm: '1.5rem' },
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Không
              </Button>
              <Button sx={{
                color: '#fff',
                fontFamily: "'Oooh Baby', serif !important",
                fontSize: { xs: '1.5rem', sm: '1.5rem' },
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} onClick={() => handleMusicChoice(true)} disabled={isTransitioning}>
                Có
              </Button>
            </MotionButtonGroup>
          </MusicContent>
        </MusicContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', overflowX: 'hidden' }}>
      <WeddingLayout>
       <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: [0, -100, 0], opacity: [1, 0.9, 1] }}
          transition={{
            duration: 3,
            repeat: 1,
            ease: "easeInOut",
            delay: 5,
          }}
          style={{ position: "relative" }} // quan trọng: để chữ định vị trong CoverSection
        >
          <CoverSection />

          {/* Chữ cố định ở dưới */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            style={{
              position: "absolute",
              bottom: "-5px", // cách mép dưới 20px
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Oooh Baby', serif",
              fontSize: "1.3rem",
              fontStyle: "italic",
              zIndex: 100,
          color: "#C62828",

              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            ↓ Cuộn xuống ↓
          </motion.div>
        </motion.div>

        <BibleSection />
  <CoverBottomSection />
        <WelcomeSection detailsRef={detailsRef} />
        <EventDetailsSection />
        <EventSection />
        <GallerySection />
        <RsvpSection />
        {/* <CountdownSection /> */}
        <WeddingGiftSection />
        <MusicPlayer /> {/* Nút bật/tắt nhạc luôn hiển thị */}
      </WeddingLayout>
    </Box>
  );
}

