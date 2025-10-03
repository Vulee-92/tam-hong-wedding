// src/sections/album/Slideshow.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Tooltip, Stack, Typography, useTheme, useMediaQuery, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion, AnimatePresence } from 'framer-motion';

import WeddingBanner from './components/WeddingBanner';
import PhotoFrame from './components/PhotoFrame';
import PhotoBoothAd from './components/PhotoBoothAd';
import { weddingData } from '../wedding/weddingData';
import VideoBanner from './components/VideoBanner';

// START: Định nghĩa hằng số và kiểu dữ liệu
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_ZjSoVgefWAEqjva4FTs0jKtokxnHkMRdcjlmMWTEu0t-h9x-yYW6QJPy4dBPeQRS/exec';
const MAIN_WEDDING_IMAGE = weddingData.images.mobilePhoto;
const DISPLAY_DURATION = 5000;
const FINAL_SCROLL_DURATION = 4000;
const TRANSITION_DURATION = 1000;
const VIDEO_PATH = '/assets/video/video.mp4';
interface ApiResponse {
  urls: string[];
}
type SlidePhase = 'musicConsent' | 'intro' | 'ad' | 'slideshow' | 'finalScroll';
type TransitionVariant = { initial: object; animate: object; exit: object; };

const transitions: Record<string, TransitionVariant> = {
  fadeIn: { initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } },
  slideUp: { initial: { y: 100, opacity: 0, rotate: 1 }, animate: { y: 0, opacity: 1, rotate: 0 }, exit: { y: -100, opacity: 0, rotate: -1 } },
  rotateIn: { initial: { scale: 0.8, opacity: 0, rotate: -10 }, animate: { scale: 1, opacity: 1, rotate: 0 }, exit: { scale: 0.9, opacity: 0, rotate: 10 } },
  heartbeat: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: [0.9, 1.03, 1], opacity: 1 }, exit: { scale: 0.95, opacity: 0 } },
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(urls.map(url => new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  })));
};

interface SlideshowProps {
  imageUrls?: string[];
  initialIndex?: number;
  onClose?: () => void;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  weddingVenue?: string;
  hasPhotoBoothAd?: boolean;
}
// END: Định nghĩa hằng số và kiểu dữ liệu

// START: Styled Components
const MusicContainer = styled(motion.div)(({ theme }) => ({
  top: 0, left: 0, width: '100%', height: '100vh', backgroundImage: `url('/assets/images/wedding/hoahongnhe.png')`,
  backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, position: 'fixed',
}));
const MusicContent = styled(motion.div)(({ theme }) => ({
  textAlign: 'center', padding: theme.spacing(3), maxWidth: 500, position: 'relative',
}));
const MusicButtonGroup = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));
const MotionButtonGroup = motion(MusicButtonGroup);
// END: Styled Components

const Slideshow: React.FC<SlideshowProps> = ({
  imageUrls: propsImageUrls,
  initialIndex = 0,
  onClose,
  brideName = weddingData.bride.name,
  groomName = weddingData.groom.name,
  weddingDate = weddingData.weddingDate,
  weddingVenue = weddingData.day,
  hasPhotoBoothAd = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  console.log("imageUrls", imageUrls);
  const [fetchedUrls, setFetchedUrls] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<SlidePhase>('musicConsent'); // Bắt đầu thẳng vào màn hình hỏi nhạc
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentTransition, setCurrentTransition] = useState<TransitionVariant>(transitions.fadeIn);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    if (imageUrls.length <= 1) return;
    stopInterval();
    intervalRef.current = window.setInterval(() => {
      if (currentIndex === imageUrls.length - 1) {
        setCurrentPhase('finalScroll');
        stopInterval();
        setTimeout(() => {
          if (mainAudioRef.current) { mainAudioRef.current.pause(); mainAudioRef.current.currentTime = 0; setIsPlaying(true); }
          onClose?.();
        }, FINAL_SCROLL_DURATION);
      } else {
        setCurrentIndex(prev => (prev + 1) % imageUrls.length);
        setCurrentTransition(transitions[Object.keys(transitions)[Math.floor(Math.random() * Object.keys(transitions).length)]]);
      }
    }, DISPLAY_DURATION);
  }, [currentIndex, imageUrls.length, onClose, stopInterval]);

  // Khởi động fetch dữ liệu ngay lập tức khi component được mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (propsImageUrls) {
          // Nếu props có sẵn, không cần fetch
          setFetchedUrls(propsImageUrls);
        } else {
          // Ngược lại, tiến hành fetch ngầm
          const response = await fetch(APPS_SCRIPT_URL);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data: ApiResponse = await response.json();
          const uniqueUrls = [...new Set(data.urls)];
          await preloadImages(uniqueUrls);
          setFetchedUrls(uniqueUrls);
        }
      } catch (err) {
        console.error('Error loading images:', err);
        setFetchedUrls([]);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchImages();
  }, [propsImageUrls]);

  const handleMusicChoice = useCallback((shouldPlay: boolean) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentPhase('intro');
      setImageUrls(fetchedUrls || []); // Sử dụng dữ liệu đã fetch
      if (shouldPlay) {
        if (!mainAudioRef.current) {
          mainAudioRef.current = new Audio('/assets/audio/wedding.mp3');
          mainAudioRef.current.loop = true;
          mainAudioRef.current.volume = 1;
        }
        mainAudioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.warn("Không thể phát nhạc:", err));
      } else {
        setIsPlaying(false);
      }
    }, TRANSITION_DURATION);
  }, [fetchedUrls]);

  const handleBannerComplete = useCallback(() => {
    if (hasPhotoBoothAd) {
      setCurrentPhase('ad');
    } else {
      setCurrentPhase('slideshow');
      if (isPlaying && imageUrls.length > 1) {
        startInterval();
      }
    }
  }, [hasPhotoBoothAd, isPlaying, imageUrls.length, startInterval]);

  const handleSkipAdClick = useCallback(() => {
    setCurrentPhase('slideshow');
    if (isPlaying && imageUrls.length > 1) {
      startInterval();
    }
  }, [isPlaying, imageUrls.length, startInterval]);

  useEffect(() => {
    if (currentPhase === 'slideshow' && isPlaying && imageUrls.length > 1) {
      startInterval();
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [currentPhase, isPlaying, imageUrls.length, startInterval, stopInterval]);

  useEffect(() => {
    return () => {
      if (mainAudioRef.current) mainAudioRef.current.pause();
    };
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!mainAudioRef.current) return;
    if (isPlaying) {
      mainAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      mainAudioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.warn("Không thể phát nhạc:", err));
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    stopInterval();
    setCurrentIndex(prev => (prev + 1) % imageUrls.length);
    setCurrentTransition(transitions[Object.keys(transitions)[Math.floor(Math.random() * Object.keys(transitions).length)]]);
  }, [imageUrls.length, stopInterval]);

  const handlePrevious = useCallback(() => {
    stopInterval();
    setCurrentIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
    setCurrentTransition(transitions[Object.keys(transitions)[Math.floor(Math.random() * Object.keys(transitions).length)]]);
  }, [imageUrls.length, stopInterval]);

  const renderPhotoBoothLayout = useCallback(() => {
    if (imageUrls.length === 0) return null;
    if (currentPhase === 'finalScroll') {
      const extendedPhotos = [...imageUrls, ...imageUrls, ...imageUrls];
      const column1 = extendedPhotos.filter((_, index) => index % 3 === 0);
      const column2 = extendedPhotos.filter((_, index) => index % 3 === 1);
      const column3 = extendedPhotos.filter((_, index) => index % 3 === 2);
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="final-scroll-effect"
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'black', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', height: '100%', width: '100%', maxWidth: '1200px', overflow: 'hidden', p: 2 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(1), px: theme.spacing(1), animation: `slideUp ${FINAL_SCROLL_DURATION / 1000}s linear forwards`, position: 'relative', height: '200%', transform: 'translateY(0%)' }}>
                {column1.map((photo, index) => <PhotoFrame key={`col1-${index}`} src={photo} rotation={Math.random() * 6 - 3} size={isMobile ? "super_small" : "medium"} />)}
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(1), px: theme.spacing(1), animation: `slideDown ${FINAL_SCROLL_DURATION / 1000}s linear forwards`, position: 'relative', height: '200%', transform: 'translateY(-100%)' }}>
                {column2.map((photo, index) => <PhotoFrame key={`col2-${index}`} src={photo} rotation={Math.random() * 6 - 3} size={isMobile ? "super_small" : "medium"} />)}
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing(1), px: theme.spacing(1), animation: `slideUp ${FINAL_SCROLL_DURATION / 1000}s linear forwards`, position: 'relative', height: '200%', transform: 'translateY(0%)' }}>
                {column3.map((photo, index) => <PhotoFrame key={`col3-${index}`} src={photo} rotation={Math.random() * 6 - 3} size={isMobile ? "super_small" : "medium"} />)}
              </Box>
            </Box>
            <style>{`@keyframes slideUp { 0% { transform: translateY(0%); } 100% { transform: translateY(-50%); } } @keyframes slideDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0%); } }`}</style>
          </motion.div>
        </AnimatePresence>
      );
    }
    if (isMobile) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-photo-${currentIndex}`}
            initial={currentTransition.initial} animate={currentTransition.animate} exit={currentTransition.exit} transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <PhotoFrame src={imageUrls[currentIndex]} rotation={Math.random() * 8 - 4} size="small" />
          </motion.div>
        </AnimatePresence>
      );
    }
    const desktopLayouts = [
      () => (
        <AnimatePresence mode="wait">
          <motion.div key={`desktop-layout-single-${currentIndex}`} initial={currentTransition.initial} animate={currentTransition.animate} exit={currentTransition.exit} transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <PhotoFrame src={imageUrls[currentIndex]} rotation={Math.random() * 6 - 3} size="large" />
          </motion.div>
        </AnimatePresence>
      ),
      () => (
        <AnimatePresence mode="wait">
          <motion.div key={`desktop-layout-double-${currentIndex}`} initial={currentTransition.initial} animate={currentTransition.animate} exit={currentTransition.exit} transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Stack direction="row" spacing={4} sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <PhotoFrame src={imageUrls[currentIndex]} rotation={Math.random() * 8 - 4} size="medium" />
              <PhotoFrame src={imageUrls[(currentIndex + 1) % imageUrls.length]} rotation={Math.random() * 8 - 4} size="medium" delay={0.3} />
            </Stack>
          </motion.div>
        </AnimatePresence>
      ),
    ];
    const randomLayout = desktopLayouts[Math.floor(Math.random() * desktopLayouts.length)];
    return randomLayout();
  }, [currentIndex, imageUrls, isMobile, currentTransition, currentPhase, theme]);


  return (
    <Box
      sx={{
        position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1500, overflow: 'hidden',
        background: currentPhase === 'slideshow' || currentPhase === 'finalScroll' ?
          'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #fad0c4 50%, #ffd1ff 100%)' : '#000',
      }}
    >
         {loading ? (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fdf9f4',
            zIndex: 1600,
          }}
        >
          <CircularProgress sx={{ color: '#000', mb: 2 }} />
          <Typography variant="h6" sx={{ fontFamily: "'Cormorant Garamond', serif", color: '#555' }}>
            Đang tải album ảnh...
          </Typography>
        </Box>
      ) : (
<>
      <AnimatePresence mode="wait">
        {currentPhase === 'musicConsent' && (
          <MusicContainer
            key="music-consent-screen"
            initial={{ opacity: 0 }} animate={{ opacity: isTransitioning ? 0 : 1 }} transition={{ duration: 0.8 }}
          >
            <MusicContent>
              <Typography variant="h4" sx={{ color: '#928362', fontFamily: "'Oooh Baby', serif", fontSize: { xs: '2rem', sm: '2.5rem' }, fontWeight: 500, mb: 2, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                Thêm chút nhạc?
              </Typography>
              <Typography sx={{ color: '#000', fontSize: { xs: '1rem', sm: '1rem' }, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', mb: 4, letterSpacing: '0.03em' }}>
                Một bản nhạc đặc biệt cho khoảnh khắc đặc biệt
              </Typography>
              <MotionButtonGroup direction="row" spacing={2} justifyContent="center"
                animate={isTransitioning ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Button onClick={() => handleMusicChoice(false)} disabled={isTransitioning} sx={{ color: '#000', fontFamily: "'Oooh Baby', serif", fontSize: { xs: '1.5rem', sm: '1.5rem' }, fontWeight: 400, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  Không
                </Button>
                <Button onClick={() => handleMusicChoice(true)} disabled={isTransitioning} sx={{ color: '#000', fontFamily: "'Oooh Baby', serif", fontSize: { xs: '1.5rem', sm: '1.5rem' }, fontWeight: 400, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  Có
                </Button>
              </MotionButtonGroup>
            </MusicContent>
          </MusicContainer>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: TRANSITION_DURATION / 1000, ease: "easeInOut" }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 1400 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentPhase === 'intro' && (
          <motion.div key="intro-screen" style={{ width: '100%', height: '100%' }}>
            <WeddingBanner
              image={MAIN_WEDDING_IMAGE} brideName={brideName} groomName={groomName} weddingDate={weddingDate} weddingVenue={weddingVenue}
              isMobile={isMobile} isVisible={true} onComplete={handleBannerComplete}
            />
            {/* <VideoBanner
              videoSrc={VIDEO_PATH}
              onComplete={handleBannerComplete}
            /> */}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentPhase === 'ad' && (
          <motion.div
            key="ad-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: '#f8f8f8', zIndex: 1500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <PhotoBoothAd onSkipClick={handleSkipAdClick} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(currentPhase === 'slideshow' || currentPhase === 'finalScroll') && (
          <motion.div key="slideshow-screen" {...transitions.fadeIn} style={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: isMobile ? 1 : 4 }}>
              {renderPhotoBoothLayout()}
            </Box>

            {currentPhase === 'slideshow' && (
              <>
                {!isMobile && (
                  <>
                    <IconButton onClick={handlePrevious} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.7)', bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,182,193,0.9)', color: 'white', transform: 'translateY(-50%) scale(1.1)' }, transition: 'all 0.3s ease', zIndex: 1501 }}>
                      <ArrowBackIosNewIcon fontSize="large" />
                    </IconButton>
                    <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.7)', bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,182,193,0.9)', color: 'white', transform: 'translateY(-50%) scale(1.1)' }, transition: 'all 0.3s ease', zIndex: 1501 }}>
                      <ArrowForwardIosIcon fontSize="large" />
                    </IconButton>
                  </>
                )}
                <Stack direction="row" spacing={isMobile ? 1 : 2} sx={{ position: 'absolute', bottom: isMobile ? 16 : 32, left: '50%', transform: 'translateX(-50%)', bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(15px)', borderRadius: '50px', p: isMobile ? 1 : 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', zIndex: 1501, maxWidth: isMobile ? '90%' : 'auto' }}>
                  {isMobile && <IconButton onClick={handlePrevious} size="small" sx={{ color: '#ff69b4', '&:hover': { bgcolor: 'rgba(255, 182, 193, 0.2)' } }}><ArrowBackIosNewIcon fontSize="small" /></IconButton>}
                  <Tooltip title={isPlaying ? 'Tạm dừng slideshow' : 'Bắt đầu slideshow'}>
                    <IconButton onClick={handlePlayPause} size={isMobile ? "small" : "medium"} sx={{ color: '#ff69b4', '&:hover': { bgcolor: 'rgba(255, 182, 193, 0.2)', transform: 'scale(1.1)' } }}>
                      {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
                    </IconButton>
                  </Tooltip>
                  {isMobile && <IconButton onClick={handleNext} size="small" sx={{ color: '#ff69b4', '&:hover': { bgcolor: 'rgba(255, 182, 193, 0.2)' } }}><ArrowForwardIosIcon fontSize="small" /></IconButton>}
                  {!isMobile && <Box sx={{ borderLeft: '1px solid rgba(0,0,0,0.1)', height: 40 }} />}
                  <Tooltip title={`Ảnh ${currentIndex + 1}/${imageUrls.length}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', px: isMobile ? 1 : 2 }}>
                      <FavoriteIcon sx={{ color: '#ff69b4', fontSize: isMobile ? '0.9rem' : '1rem', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#000', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                        {currentIndex + 1}/{imageUrls.length}
                      </Typography>
                    </Box>
                  </Tooltip>
                  {onClose && (
                    <>
                      {!isMobile && <Box sx={{ borderLeft: '1px solid rgba(0,0,0,0.1)', height: 40 }} />}
                      <Tooltip title="Đóng slideshow">
                        <IconButton onClick={onClose} size={isMobile ? "small" : "medium"} sx={{ color: 'rgba(0,0,0,0.6)', '&:hover': { bgcolor: 'rgba(255, 99, 99, 0.2)', color: '#ff6363', transform: 'scale(1.1)' } }}>
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </>
         )}
    </Box>
  );
};

export default Slideshow;