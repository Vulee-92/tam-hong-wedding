// src/sections/auth/sign-in-view.tsx

import { useState, useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useAuth } from 'src/context/AuthContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

export function SignInView() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Thêm state loading

    const handleSignIn = useCallback(() => {
        const secretCode = '121025'; 

        if (password === secretCode) {
            setLoading(true); // Bắt đầu loading
            setTimeout(() => {
                signIn();
                router.push('/welcome');
                setLoading(false); // Kết thúc loading sau khi chuyển trang
            }, 2000); // Trì hoãn 2 giây
        } else {
            alert('Mã đăng nhập không đúng!');
        }
    }, [password, signIn, router]);

    const renderForm = (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <TextField
                fullWidth
                name="password"
                label="Mã đăng nhập"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                sx={{ mb: 3 }}
                disabled={loading}
            />
            <Button
                fullWidth
                size="large"
                type="submit"
                color="inherit"
                variant="contained"
                onClick={handleSignIn}
                disabled={loading} 
                startIcon={loading && <CircularProgress size={24} color="inherit" />}
            >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
        </Box>
    );

    return (
        <Box>
            <Box
                sx={{
                    gap: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 5,
                }}
            >
                <Typography variant="h5">Đăng nhập để xem Dashboard</Typography>
            </Box>
            {renderForm}
        </Box>
    );
}