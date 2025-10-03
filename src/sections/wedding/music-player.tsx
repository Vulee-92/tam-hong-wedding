/* eslint-disable */
import { styled } from '@mui/material/styles';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { weddingStyles } from './styles';
import { useAudio } from 'src/context/AudioContext';   // 👈 dùng context

const PlayerWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 1000,
}));

const MusicButton = styled(IconButton)(({ theme }) => ({
    background: "#C62828",
  color: '#fff',
  '&:hover': {
    background: weddingStyles.colors.accent,
    transform: 'scale(1.1) rotate(10deg)',
  },
  width: 48,
  height: 48,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
}));

export function MusicPlayer() {
  const { audioRef, isPlaying, play, pause } = useAudio();   // 👈 lấy từ context

  // Hàm fade volume (mượt khi play/pause)
  const fadeVolume = (targetVolume: number, duration: number) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const startTime = Date.now();

    const animateFade = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        audio.volume = startVolume + (targetVolume - startVolume) * progress;
        requestAnimationFrame(animateFade);
      } else {
        audio.volume = targetVolume;
        if (targetVolume === 0) {
          audio.pause();
        }
      }
    };

    requestAnimationFrame(animateFade);
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Fade out rồi pause
      fadeVolume(0, 500);
      pause();
    } else {
      // Fade in khi phát nhạc
      audioRef.current.volume = 0;
      try {
        await play();
        fadeVolume(0.5, 500);  // fade tới 50% volume
      } catch (err) {
        console.error('Không thể phát nhạc:', err);
      }
    }
  };

  return (
    <PlayerWrapper>
      <Tooltip title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}>
        <MusicButton
          onClick={togglePlay}
          sx={{
            animation: isPlaying ? 'spin 4s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >
          <Iconify
            icon={isPlaying ? 'mdi:music-note' : 'mdi:music-note-off'}
            width={24}
          />
        </MusicButton>
      </Tooltip>
    </PlayerWrapper>
  );
}
