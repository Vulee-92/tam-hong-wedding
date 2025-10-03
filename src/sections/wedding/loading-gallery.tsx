import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Modal, Typography, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Iconify } from 'src/components/iconify';
import { weddingData } from './weddingData';

const revealText = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const letterReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px) rotate(-3deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
`;

const glowPulse = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(255,255,255,0.1),
                 0 0 20px rgba(255,255,255,0.1);
  }
  50% {
    text-shadow: 0 0 20px rgba(255,255,255,0.3),
                 0 0 40px rgba(255,255,255,0.2);
  }
  100% {
    text-shadow: 0 0 10px rgba(255,255,255,0.1),
                 0 0 20px rgba(255,255,255,0.1);
  }
`;


const LoadingContainer = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  background: '#000000',
  color: '#ffffff',
  touchAction: 'none',
}));

const Sequence = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const ImageWrapper = styled(motion.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
    opacity: 0.85,
    transition: 'opacity 1s ease',
  },
});

const Image = styled(motion.img)({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: 'scale(1.1)',
  transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
});

const Content = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  // padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",

  fontSize: 'clamp(1rem, 12vw, 1rem)',
  fontWeight: 300,
  letterSpacing: '0.05em',
  lineHeight: 1.2,
  marginBottom: theme.spacing(1),
  color: '#ffffff',
  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
  animation: `${glowPulse} 3s ease-in-out infinite`,
  '& > span': {
    display: 'inline-block',
    opacity: 0,
    animation: `${letterReveal} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
    '&:nth-of-type(even)': {
      animationDelay: '0.05s',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 'clamp(3rem, 5vw, 3rem)',
    letterSpacing: '0.03em',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: 'clamp(1rem, 1vw, 1rem)',
  fontWeight: 300,
  fontStyle: 'italic',
  letterSpacing: '0.15em',
  color: 'rgba(255,255,255,0.95)',
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  opacity: 0,
  animation: `${revealText} 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  animationDelay: '0.6s',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40%',
    height: '1px',
    background: 'rgba(255,255,255,0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: 10,
    fontSize: 'clamp(1rem, 2.5vw, 1rem)',
    letterSpacing: '0.1em',
  },
}));

const Progress = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(8),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2.5),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(6),
    gap: theme.spacing(2),
  },
}));

const ProgressDot = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: active ? '#fff' : 'rgba(255,255,255,0.2)',
  transform: active ? 'scale(1.3)' : 'scale(1)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? '0 0 15px rgba(255,255,255,0.5)' : 'none',
}));

const GalleryGrid = styled(motion.div)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 2,
  width: '100%',
  background: '#000',
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  },
}));

const GalleryImage = styled(motion.div)({
  position: 'relative',
  aspectRatio: '3/4',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover img': {
    transform: 'scale(1.03)',
  },
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
});

// Add SwipeIndicator component
const SwipeIndicator = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(12),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: '#fff',
  opacity: 0.8,
  animation: 'swipeAnimation 2s infinite',
  [theme.breakpoints.up('md')]: {
    display: 'none', // Hide on desktop
  },
  '@keyframes swipeAnimation': {
    '0%, 100%': {
      transform: 'translate(-50%, 0)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'translate(-50%, -10px)',
      opacity: 1,
    },
  },
}));

interface LoadingGalleryProps {
  images: string[];
  galleryImages: string[];
  onLoadingComplete?: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  hasSeenIntro?: boolean;
  onSkipIntro?: () => void;
}

export function LoadingGallery({
  images,
  galleryImages,
  onLoadingComplete,
  audioRef,
  isPlaying,
  setIsPlaying,
  hasSeenIntro = false,
  onSkipIntro
}: LoadingGalleryProps) {
  const [stage, setStage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);




  // Minimum distance for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;

    if (isUpSwipe && hasSeenIntro) {
      onLoadingComplete?.();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const sequences = [
    {
      image: "https://res.cloudinary.com/dxfsa7foy/image/upload/v1754386400/IMG_8343_lgneje.jpg",
      title: "Ngày Chung Đôi",
      subtitle: "Khởi đầu chặng đường hạnh phúc",
    },
    {
      image: images[4],
      title: weddingData.groom.name,
      subtitle: "Chàng rể đầy yêu thương",
    },
    {
      image: images[2],
      title: weddingData.bride.name,
      subtitle: "Nàng dâu xinh đẹp và dịu dàng",
    },
    {
      image: images[5],
      title: "Gia Đình Trong Chúa",
      subtitle: "Cùng nhau sống trọn vẹn trong tình yêu và ơn lành của Ngài",
    },
    {
      image: '/assets/images/wedding/anhchinh.jpg',
      title: "Hẹn Gặp Nhé!",
      subtitle: "Rất mong sẻ chia niềm vui cùng bạn",
    },

  ];



  const getTransitionVariant = (index: number) => {
    const variants = [
      {
        // Fade and slide up (original)
        enter: { y: 100, opacity: 0, scale: 1.2 },
        center: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] }
        },
        exit: {
          y: -50,
          opacity: 0,
          transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
        }
      },
      {
        // Gentle zoom with rotation
        enter: { scale: 1.4, rotate: -3, opacity: 0 },
        center: {
          scale: 1,
          rotate: 0,
          opacity: 1,
          transition: { duration: 2, ease: [0.4, 0, 0.2, 1] }
        },
        exit: {
          scale: 0.95,
          rotate: 3,
          opacity: 0,
          transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1] }
        }
      },
      {
        // Slide from right with fade
        enter: { x: '100%', opacity: 0, scale: 1.1 },
        center: {
          x: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 2, ease: [0.3, 0.1, 0.3, 1] }
        },
        exit: {
          x: '-50%',
          opacity: 0,
          transition: { duration: 1.5, ease: [0.3, 0.1, 0.3, 1] }
        }
      },
      {
        // Cross-fade with scale
        enter: { scale: 1.3, opacity: 0 },
        center: {
          scale: 1,
          opacity: 1,
          transition: { duration: 2, ease: [0.4, 0, 0.2, 1] }
        },
        exit: {
          scale: 0.9,
          opacity: 0,
          transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1] }
        }
      },
      {
        // Diagonal slide with rotation
        enter: { x: 100, y: 100, rotate: -5, opacity: 0, scale: 1.2 },
        center: {
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] }
        },
        exit: {
          x: -50,
          y: -50,
          rotate: 5,
          opacity: 0,
          transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
        }
      }
    ];
    return variants[index % variants.length];
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 45
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  useEffect(() => {
    const duration = 4000; // 4 seconds per sequence

    const timer = setInterval(() => {
      setStage((prev) => {
        // Only try to play music if user chose to play and we're not already playing
        if (prev === 0 && audioRef.current && isPlaying && audioRef.current.paused) {
          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
        }

        if (prev >= sequences.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setIsIntroComplete(true);
            onLoadingComplete?.();
          }, 1200);
          return prev;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearInterval(timer);
  }, [sequences.length, onLoadingComplete, audioRef, isPlaying, setIsPlaying]);

  // Add music control button with fade effect
  const MusicControl = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    top: 20,
    right: 20,
    color: '#fff',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    padding: 12,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
      transform: 'scale(1.1) rotate(10deg)',
    },
  }));

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // Fade out
        let vol = audioRef.current.volume;
        const interval = setInterval(() => {
          if (vol > 0) {
            vol = Math.max(0, vol - 0.1);
            audioRef.current!.volume = vol;
            if (vol === 0) {
              clearInterval(interval);
              audioRef.current!.pause();
              setIsPlaying(false);
            }
          }
        }, 100);
      } else {
        // Fade in
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          let vol = 0;
          const interval = setInterval(() => {
            if (vol < 0.5) {
              vol = Math.min(0.5, vol + 0.1);
              audioRef.current!.volume = vol;
              if (vol === 0.5) clearInterval(interval);
            }
          }, 100);
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const SkipButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    padding: theme.spacing(1.2, 4),
    borderRadius: 50,
    fontSize: '1rem',
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: '1px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    textTransform: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.2)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    }
  }));

  if (isIntroComplete) {
    return (
      <GalleryGrid
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {galleryImages.map((image, index) => (
          <GalleryImage
            key={index}
            onClick={() => setSelectedImage(image)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StyledImage src={image} alt={`Wedding photo ${index + 1}`} />
          </GalleryImage>
        ))}
        <Modal
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          sx={{
            bgcolor: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              height: '90vh',
              outline: 'none',
            }}
          >
            <AnimatePresence>
              {selectedImage && (
                <motion.img
                  src={selectedImage}
                  alt="Selected photo"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </AnimatePresence>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                color: '#fff',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Iconify icon="mdi:close" />
            </IconButton>
          </Box>
        </Modal>
      </GalleryGrid>
    );
  }

  const currentSequence = sequences[stage];

  return (
    <LoadingContainer
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <MusicControl onClick={toggleMusic}>
        <Iconify icon={isPlaying ? "mdi:music-note" : "mdi:music-note-off"} width={24} />
      </MusicControl>
      {hasSeenIntro && (
        <>
          {/* Show button only on desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <SkipButton onClick={onSkipIntro}>
              Đi đến trang chính
            </SkipButton>
          </Box>
          {/* Show swipe indicator only on mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <SwipeIndicator>
              <Iconify icon="mdi:chevron-up" width={32} />
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: '1px',
                  opacity: 0.8
                }}
              >
                Vuốt lên để bỏ qua
              </Typography>
            </SwipeIndicator>
          </Box>
        </>
      )}
      <Sequence>
        <AnimatePresence mode="wait">
          <ImageWrapper key={`image-${stage}`}>
            <Image
              src={currentSequence.image}
              alt="Wedding sequence"
              variants={getTransitionVariant(stage)}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                filter: 'brightness(0.85)',
                transition: 'filter 1s ease-in-out'
              }}
            />
          </ImageWrapper>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <Content
            key={`content-${stage}`}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={textVariants}>
              <Title sx={{ fontSize: 'clamp(1rem, 4vw, 2rem)', fontFamily: "'Oooh Baby', serif" }}>
                {currentSequence.title.split('').map((letter, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: 'clamp(1.875rem, 4vw, 2rem)',
                      animationDelay: `${index * 0.05}s`,
                      fontFamily: "'Oooh Baby', serif",
                      display: 'inline-block'
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </Title>
            </motion.div>
            <motion.div variants={textVariants}>
              <Subtitle variant="subtitle1">{currentSequence.subtitle}</Subtitle>
            </motion.div>
          </Content>
        </AnimatePresence>
        <Progress>
          {sequences.map((_, index) => (
            <ProgressDot key={index} active={index === stage} />
          ))}
        </Progress>
      </Sequence>
    </LoadingContainer>
  );
} 