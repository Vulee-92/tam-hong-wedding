import { Box, IconButton, Typography, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from '../iconify';

const ControlsWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  zIndex: 1000,
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease',
  '&.visible': {
    transform: 'translateY(0)',
  }
}));

interface AudioControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  visible: boolean;
}

export function AudioControls({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onStop,
  visible
}: AudioControlsProps) {
  return (
    <ControlsWrapper className={visible ? 'visible' : ''}>
      <Typography variant="subtitle2" color="text.secondary">
        Đang đọc bài viết...
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isPlaying && !isPaused ? (
          <IconButton onClick={onPause} color="primary">
            <Iconify icon="mdi:pause" />
          </IconButton>
        ) : (
          <IconButton onClick={onPlay} color="primary">
            <Iconify icon="mdi:play" />
          </IconButton>
        )}

        <IconButton onClick={onStop} color="error">
          <Iconify icon="mdi:stop" />
        </IconButton>
      </Box>
    </ControlsWrapper>
  );
} 