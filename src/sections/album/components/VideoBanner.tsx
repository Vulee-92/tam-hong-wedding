// src/sections/album/components/VideoBanner.tsx
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface VideoBannerProps {
  videoSrc: string;
  onComplete: () => void;
}

const VideoBanner: React.FC<VideoBannerProps> = ({ videoSrc, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Thêm một hằng số để định nghĩa tốc độ phát
  const playbackRate = 0.5; // Đặt tốc độ chậm hơn, ví dụ 0.5 (50% tốc độ gốc)

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleVideoEnd = () => {
        onComplete();
      };
      videoElement.addEventListener('ended', handleVideoEnd);

      // Thêm dòng này để điều chỉnh tốc độ phát
      videoElement.playbackRate = playbackRate;

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [onComplete, playbackRate]);

  return (
    <Box
      sx={{
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 1500,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#000',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

export default VideoBanner;