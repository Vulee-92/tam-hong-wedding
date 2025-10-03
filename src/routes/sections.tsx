import { lazy, Suspense, useState, useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import { varAlpha } from 'src/theme/styles'; // Giả sử hàm varAlpha đã được định nghĩa
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthLayout } from 'src/layouts/auth';
import LoadingScreen from './components/LoadingScreen';

import Guestbook from 'src/sections/wedding/Guestbook';
import RSVPList from 'src/sections/wedding/RSVPList';
import { AuthProvider, useAuth } from 'src/context/AuthContext';
import WeddingStepGuests from 'src/sections/wedding/WeddingStepGuests';
import WelcomePage from 'src/sections/welcomePage/WelcomePage';
import Slideshow from 'src/sections/album/Slideshow';
import PhotoAlbum from 'src/sections/album/PhotoAlbum';

// Hàm render fallback
const renderFallback = () => (
    <Box
        sx={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

// Lazy-loaded components
const WeddingPage = lazy(() => import('src/pages/wedding'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Hiển thị loading khi đang kiểm tra xác thực
        return <LinearProgress />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

// Main Routes
function AppRoutes() {
    const routes = useRoutes([
        { path: '/', element: <Suspense fallback={<LoadingScreen onComplete={() => {}} />}><WeddingPage /></Suspense> },
        { path: '/p/*', element: <Suspense fallback={<LoadingScreen onComplete={() => {}} />}><WeddingPage /></Suspense> },
        // { path: '/album-slide', element: <Suspense fallback={<LoadingScreen onComplete={() => {}} />}><QRCodeDisplay /></Suspense> },
        {
            path: '/link-generator',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <WeddingStepGuests />
                        </Suspense>
                    </DashboardLayout>
                </ProtectedRoute>
            ),
        },
  {
            path: '/welcome',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <WelcomePage />
                        </Suspense>
                    </DashboardLayout>
                </ProtectedRoute>
            ),
        },
        
        {
            path: '/album',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <PhotoAlbum />
                        </Suspense>
                    </DashboardLayout>
                </ProtectedRoute>
            ),
        },
        {
            path: '/slide-wedding',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <Slideshow />
                        </Suspense>
                    </DashboardLayout>
                </ProtectedRoute>
            ),
        },
 
        {
            path: '/guestbook',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <Guestbook />
                        </Suspense>
                    </DashboardLayout>
                </ProtectedRoute>
            ),
        },
      
        {
            path: '/rsvp',
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <RSVPList />
                        </Suspense>
                    </DashboardLayout>
                </ProtectedRoute>
            ),
        },
        {
            path: 'sign-in',
            element: (
                <AuthLayout>
                    <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
                        <SignInPage />
                    </Suspense>
                </AuthLayout>
            ),
        },
        {
            path: '*',
            element: <Navigate to="/sign-in" replace />,
        },
    ]);

    return routes;
}

// Router Component
export function Router() {
    // Trạng thái loading ban đầu của trang
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 3000); 
        return () => clearTimeout(timer);
    }, []);

    // Hiển thị loading ban đầu trong 3 giây
    if (isInitialLoad) {
        return <LoadingScreen onComplete={() => {}} />;
    }
    
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}