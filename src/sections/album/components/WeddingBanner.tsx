import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Box, Typography, Stack } from "@mui/material";

interface WeddingBannerProps {
  image: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingVenue: string;
  isMobile?: boolean;
  isVisible?: boolean;
  bannerDisplayDuration?: number;
  saveDisplayDuration?: number;
  onComplete?: () => void;
}

const DEFAULT_BANNER_MS = 9000;
const DEFAULT_SAVE_MS = 4500;

const WeddingBanner: React.FC<WeddingBannerProps> = ({
  image,
  brideName,
  groomName,
  weddingDate,
  weddingVenue,
  isMobile = false,
  isVisible = true,
  bannerDisplayDuration = DEFAULT_BANNER_MS,
  saveDisplayDuration = DEFAULT_SAVE_MS,
  onComplete,
}) => {
  const bannerControls = useAnimation();
  const [stage, setStage] = useState<"banner" | "save" | "done">("banner");

  const bannerTimerRef = useRef<number | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    // khi stage là banner -> chạy hiệu ứng fade in
    bannerControls.set({ opacity: 0, y: 20, scale: 1.02 });
    bannerControls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    });

    // set timer chỉ sau khi banner đã mount
    bannerTimerRef.current = window.setTimeout(() => {
      bannerControls
        .start({
          opacity: 0,
          y: -10,
          scale: 0.98,
          transition: { duration: 1.0, ease: "easeInOut" },
        })
        .then(() => setStage("save"));
    }, bannerDisplayDuration);

    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [isVisible, bannerDisplayDuration, bannerControls]);

  useEffect(() => {
    if (stage === "save") {
      saveTimerRef.current = window.setTimeout(() => {
        setStage("done");
        onComplete?.();
      }, saveDisplayDuration);
    }
  }, [stage, saveDisplayDuration, onComplete]);

  const bgColor = "#0b0b0b";
  const accent = "#D4B483";
  const ivory = "#F4EFEA";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: isMobile ? 450 : 700,
        background: bgColor,
        color: ivory,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BANNER */}
      <AnimatePresence mode="wait">
        {stage === "banner" && (
          <motion.div
            key="banner"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={bannerControls}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              padding: isMobile ? "24px 20px" : "40px 64px",
            }}
          >
            {/* LEFT */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontFamily: "'ClassiqueSaigon', serif",
                  fontWeight: 700,
                  fontSize: isMobile ? "2rem" : "4rem",
                  lineHeight: 1.05,
                  color: ivory,
                }}
              >
                {groomName}

              </Typography>
              <Box
                component="span"
                sx={{
                  color: accent,
                  fontFamily: "'ClassiqueSaigon', serif",
                  mx: 1,
                  fontSize: isMobile ? "1.6rem" : "2rem",
                }}
              >&</Box>
              <Typography
                sx={{
                  fontFamily: "'ClassiqueSaigon', serif",
                  fontWeight: 700,
                  fontSize: isMobile ? "2rem" : "4rem",
                  lineHeight: 1.05,
                  color: ivory,
                }}
              >



                {brideName}
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: isMobile ? 12 : 14,
                    color: "#cfcfcf",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Wedding Slideshow
                </Typography>
                <Typography
                  sx={{ fontSize: isMobile ? 11 : 13, color: "#9f9f9f" }}
                >
                  {weddingDate} — {weddingVenue}
                </Typography>
              </Stack>
            </Box>

            {/* RIGHT */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <Box
                sx={{
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#111",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                  width: isMobile ? "70%" : "100%",
                  aspectRatio: "3/4",
                }}
              >
                <motion.img
                  src={image}
                  alt="wedding"
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          </motion.div>
        )}

        {/* SAVE THE DATE */}
        {stage === "save" && (
          <motion.div
            key="save"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: isMobile ? "2.4rem" : "3.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Save the Date
            </Typography>
            <Typography
              sx={{ mt: 2, color: "#ccc", fontFamily: "'Montserrat', sans-serif" }}
            >
              {weddingDate} • {weddingVenue}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default WeddingBanner;
