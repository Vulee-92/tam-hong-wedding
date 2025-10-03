import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from '../iconify';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => boolean;
}

export function RecruiterAuthDialog({ open, onClose, onVerify }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = () => {
    const isValid = onVerify(code);
    if (!isValid) {
      setError(true);
      return;
    }
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mdi:shield-lock" />
          <Typography>Xác thực Nhà tuyển dụng</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Mã xác thực không đúng
          </Alert>
        )}
        <TextField
          fullWidth
          label="Nhập mã xác thực"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          type="password"
          autoFocus
        />
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
          Vui lòng liên hệ để nhận mã xác thực
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleVerify}>
          Xác nhận
        </Button>
      </DialogActions>
    </StyledDialog>
  );
} 