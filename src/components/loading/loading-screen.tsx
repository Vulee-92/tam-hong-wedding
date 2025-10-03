import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

const LoadingContainer = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: '#000000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
});

const SVGContainer = styled(motion.div)({
  width: '500px',
  height: '200px',
  position: 'relative',
});

const StyledText = styled('text')({
  fontFamily: 'League Script',
  fontSize: '120px',
  fill: 'none',
  stroke: '#ffffff',
  strokeWidth: 0.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
});

const LetterWrapper = styled(motion.span)({
  display: 'inline-block',
  fontSize: '4rem',
  fontFamily: 'dynapuff',
  color: '#ffffff',
  fontWeight: 700,
});

interface LoadingScreenProps {
  onComplete: () => void;
  type?: 'writing' | 'bubble' | 'typewriter' | 'glitch' | 'circular';
}

export function LoadingScreen({ onComplete, type = 'writing' }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const letters = "Vulee".split("");

  const textVariants = {
    hidden: {
      opacity: 0,
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      filter: 'blur(10px)',
    },
    visible: (i: number) => ({
      opacity: 1,
      strokeDashoffset: 0,
      filter: 'blur(0px)',
      transition: {
        strokeDashoffset: {
          duration: 2.5,
          ease: [0.43, 0.13, 0.23, 0.96],
          delay: i * 0.25
        },
        filter: {
          duration: 1,
          delay: i * 0.25
        },
        opacity: {
          duration: 0.1,
          delay: i * 0.25
        }
      }
    })
  };

  const cursorVariants = {
    hidden: { 
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1.2, 1.2, 0.5],
      filter: ['blur(2px)', 'blur(4px)', 'blur(4px)', 'blur(2px)'],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.5
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        when: "afterChildren",
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotate: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.5
      }
    }
  };

  const typewriterVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "auto",
      opacity: 1,
      transition: {
        width: { duration: 2, ease: "easeOut" },
        opacity: { duration: 0.3 }
      }
    }
  };

  const glitchVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      x: [0, -2, 2, -2, 0],
      y: [0, 2, -2, 2, 0],
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(180deg)',
        'hue-rotate(270deg)',
        'hue-rotate(0deg)'
      ],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror" as const,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: "linear"
      }
    }
  };

  const glitchAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1
      }
    }
  };

  const circularPathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, type === 'writing' ? 4000 : 3000);

    return () => clearTimeout(timer);
  }, [onComplete, type]);

  if (type === 'typewriter') {
    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <motion.div
                style={{
                  fontSize: '4rem',
                  color: '#fff',
                  fontFamily: 'monospace',
                  borderRight: '2px solid #fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
                variants={typewriterVariants}
                initial="hidden"
                animate="visible"
              >
                Vulee
              </motion.div>
            </Box>
          </LoadingContainer>
        )}
      </AnimatePresence>
    );
  }

  if (type === 'glitch') {
    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                fontSize: '4rem',
                color: '#fff',
                textShadow: '2px 2px #ff0000, -2px -2px #00ff00',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.2em'
              }}
              variants={glitchAnimation}
              initial="hidden"
              animate="visible"
             
            >
              VULEE
            </motion.div>
          </LoadingContainer>
        )}
      </AnimatePresence>
    );
  }

  if (type === 'circular') {
    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <LoadingContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ position: 'relative', width: 200, height: 200 }}>
              <motion.svg
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%' }}
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  variants={circularPathVariants}
                  initial="hidden"
                  animate="visible"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize="12"
                >
                  VULEE
                </text>
              </motion.svg>
            </Box>
          </LoadingContainer>
        )}
      </AnimatePresence>
    );
  }

  if (type === 'writing') {
    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <LoadingContainer
            initial={{ opacity: 0, background: '#000000' }}
            animate={{ 
              opacity: 1,
              background: ['#000000', '#000000'],
              transition: { duration: 0.8 }
            }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              filter: 'blur(10px)',
              transition: { duration: 0.8 } 
            }}
          >
            <SVGContainer>
              <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 500 200"
                initial="hidden"
                animate="visible"
              >
                <motion.rect
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.2"
                  strokeOpacity="0.1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                
                <StyledText
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <motion.tspan variants={textVariants} custom={0}>V</motion.tspan>
                  <motion.tspan variants={textVariants} custom={1}>u</motion.tspan>
                  <motion.tspan variants={textVariants} custom={2}>l</motion.tspan>
                  <motion.tspan variants={textVariants} custom={3}>e</motion.tspan>
                  <motion.tspan variants={textVariants} custom={4}>e</motion.tspan>
                </StyledText>
              </motion.svg>

              <motion.div
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  background: '#fff',
                  borderRadius: '50%',
                  filter: 'blur(4px)',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  mixBlendMode: 'screen',
                }}
                variants={cursorVariants}
                initial="hidden"
                animate="visible"
              />
            </SVGContainer>
          </LoadingContainer>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <LoadingContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box>
            {letters.map((letter, index) => (
              <LetterWrapper
                key={index}
                variants={letterVariants}
              >
                {letter}
              </LetterWrapper>
            ))}
          </Box>
        </LoadingContainer>
      )}
    </AnimatePresence>
  );
} 