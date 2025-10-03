// components/FullscreenViewer.tsx
import React from 'react';
import { Dialog, Box, IconButton, Tooltip, Fab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Photo } from '../PhotoAlbum';

interface FullscreenViewerProps {
    image: Photo;
    onClose: () => void;
    onDownload: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ image, onClose }) => {
    return (
        <Dialog open onClose={onClose} fullScreen sx={{ bgcolor: 'black' }}>
            <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, color: 'black', zIndex: 1100 }}>
                    <CloseIcon sx={{fontSize:150}}/>
                </IconButton>
                <Box
                    component="img"
                    src={image.url}
                    alt="Fullscreen view"
                    sx={{
                        maxWidth: '95%',
                        maxHeight: '95%',
                        objectFit: 'contain',
                        borderRadius: '8px',
                    }}
                />
            </Box>
        </Dialog>
    );
};

export default FullscreenViewer;