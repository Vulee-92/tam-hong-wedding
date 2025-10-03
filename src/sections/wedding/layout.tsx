import { styled } from '@mui/material/styles';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { WeddingFooter } from './footer';
import { weddingStyles } from './styles';

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  maxWidth: '100%',
  backgroundColor: weddingStyles.colors.background,
}));

const MainStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
}));

const ViewIntroButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(8px)',
  color: theme.palette.common.white,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  zIndex: 999,
}));

interface WeddingLayoutProps {
  children: React.ReactNode;
  onViewIntroAgain?: () => void;
}

export function WeddingLayout({ children, onViewIntroAgain }: WeddingLayoutProps) {
  return (
    <RootStyle>
      {/* <WeddingHeader /> */}
      <MainStyle>{children}</MainStyle>
      <WeddingFooter />
      {onViewIntroAgain && (
        <Tooltip title="Xem lại intro" placement="left">
          <ViewIntroButton onClick={onViewIntroAgain}>
            <Iconify icon="mdi:replay" width={24} />
          </ViewIntroButton>
        </Tooltip>
      )}
    </RootStyle>
  );
} 