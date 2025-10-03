// components/PhotoAlbumSkeleton.tsx
import React from 'react';
import { Box, Skeleton, Grid, Stack } from '@mui/material';

interface PhotoAlbumSkeletonProps {
    viewMode: 'grid' | 'list';
    count?: number;
}

const PhotoAlbumSkeleton: React.FC<PhotoAlbumSkeletonProps> = ({ viewMode, count = 12 }) => {
    // Determine the number of skeletons to render
    const skeletonItems = Array.from({ length: count });

    if (viewMode === 'list') {
        return (
            <Stack spacing={2} sx={{ p: 2 }}>
                {skeletonItems.map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', p: 1, border: '1px solid grey', borderRadius: 2 }}>
                        <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 1, mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="60%" height={16} />
                        </Box>
                    </Box>
                ))}
            </Stack>
        );
    }

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            {skeletonItems.map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Box sx={{ position: 'relative', width: '100%', pt: '100%' }}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            sx={{ position: 'absolute', top: 0, left: 0, borderRadius: 2 }}
                        />
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default PhotoAlbumSkeleton;