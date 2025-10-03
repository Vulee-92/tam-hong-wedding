import { useEffect, useRef, useState, forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Gradient tối giản và tinh tế
const gradientAnimation = {
  background: [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  ],
  transition: {
    duration: 8,
    repeat: Infinity,
    repeatType: "reverse" as const,
  },
};

// Subtle breathing effect
const BreathingOrb = () => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      width: 200,
      height: 200,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      filter: "blur(1px)",
    }}
  />
);

// Minimal floating dots
const FloatingDot = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: [0, 0.6, 0],
      y: [20, -20, -40],
      x: [0, Math.random() * 20 - 10],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeOut",
    }}
    style={{
      position: "absolute",
      width: 4,
      height: 4,
      borderRadius: "50%",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      left: `${30 + Math.random() * 40}%`,
      top: `${60 + Math.random() * 20}%`,
      boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
    }}
  />
);

// Modern progress bar
const ModernProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 4 + 2;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "280px" }}
      transition={{ delay: 1.5, duration: 0.8 }}
      style={{
        height: "2px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "1px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))",
          borderRadius: "1px",
        }}
      />
    </motion.div>
  );
};

// Clean typography
const ModernText = ({ children, delay = 0, variant = "h3" }: { 
  children: string; 
  delay?: number;
  variant?: "h3" | "h6";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
  >
    <Typography
      variant={variant}
      sx={{
        fontWeight: variant === "h3" ? "300" : "400",
        color: "rgba(255, 255, 255, 0.95)",
        letterSpacing: variant === "h3" ? "1px" : "0.5px",
        textAlign: "center",
      }}
    >
      {children}
    </Typography>
  </motion.div>
);

const LoadingSlideshow = forwardRef<HTMLDivElement, {}>(({}, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loadingText, setLoadingText] = useState("Initializing");
  const [isReadyToExit, setIsReadyToExit] = useState(false);
  const audioDuration = 5000;

  useEffect(() => {
    // Text progression
    const textTimer1 = setTimeout(() => setLoadingText("Loading assets"), 1500);
    const textTimer2 = setTimeout(() => setLoadingText("Almost ready"), 3000);

    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      
      // Kích hoạt trạng thái exit khi audio kết thúc
      const exitTimer = setTimeout(() => {
        setIsReadyToExit(true);
      }, audioDuration - 500); // 500ms trước khi audio kết thúc
      
      const fadeOutTimeout = setTimeout(() => {
        const fadeInterval = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.1) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      }, audioDuration - 1200);

      return () => {
        clearTimeout(textTimer1);
        clearTimeout(textTimer2);
        clearTimeout(fadeOutTimeout);
        clearTimeout(exitTimer);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 1;
        }
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {!isReadyToExit && (
        <motion.div
          ref={ref}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
          animate={gradientAnimation}
        >
          {/* Audio */}
          <audio ref={audioRef} src="/assets/audio/intro.mp3" preload="auto" />

          {/* Background orb */}
          <BreathingOrb />

          {/* Floating dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <FloatingDot key={i} delay={i * 0.5} />
          ))}

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
            }}
          >
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ marginBottom: "32px" }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: "48px",
                  opacity: 0.9,
                }}
              >
                🎬
              </Typography>
            </motion.div>

            {/* Title */}
            <ModernText delay={0.6}>Slideshow Album</ModernText>

            {/* Dynamic subtitle */}
            <motion.div
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{ margin: "24px 0" }}
            >
              <ModernText children={loadingText} delay={0} variant="h6"/>
            </motion.div>

            {/* Progress bar */}
            <ModernProgressBar />

            {/* Version/Brand subtle text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2, duration: 1 }}
              style={{ marginTop: "40px" }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.4)",
                }}
              >
                Premium Experience
              </Typography>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default LoadingSlideshow;