import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Stack, // Thêm Stack để bố cục gọn hơn
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ModerationAction, Photo, PhotoActioned } from '../PhotoAlbum';
import { AnimatePresence, motion } from 'framer-motion';

interface PhotoGridProps {
    images: Photo[];
    selectedPublicIds: Set<string>;
    handleToggleSelection: (publicId: string) => void;
    handleModerationSingle: (publicId: string, action: ModerationAction) => void;
    handleToggleFavorite: (publicId: string, isFavorite: boolean) => Promise<void>;
    handleUpdateTags: (publicId: string, newTags: string[]) => Promise<void>;
    setFullscreenImage: (image: Photo | null) => void;
    isCoupleMode: boolean;
}

const getExitAnimation = (actionType?: PhotoActioned) => {
    switch (actionType) {
        case 'approved':
            return { opacity: 1, scale: 1 };
        case 'rejected':
            return { opacity: 0, scale: 0.8, transition: { duration: 0.5 } };
        case 'deleted':
            return { opacity: 0, x: -100, transition: { duration: 0.5 } };
        default:
            return { opacity: 0, scale: 0.8, transition: { duration: 0.3 } };
    }
};

const predefinedTags = ['Bạn thân', 'Gia đình', 'Người quen', 'Đồng nghiệp'];

const PhotoGrid: React.FC<PhotoGridProps> = ({
    images,
    selectedPublicIds,
    handleToggleSelection,
    handleModerationSingle,
    handleToggleFavorite,
    handleUpdateTags,
    setFullscreenImage,
    isCoupleMode
}) => {
    const [taggingImage, setTaggingImage] = useState<Photo | null>(null);
    const [newTagInput, setNewTagInput] = useState('');
    const [tempTags, setTempTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleOpenTagDialog = (e: React.MouseEvent, image: Photo) => {
        e.stopPropagation();
        setTaggingImage(image);
        setTempTags(image.tags || []);
        setError(null);
    };

    const handleAddTag = (tag: string) => {
        if (tempTags.length >= 2) {
            setError('Bạn chỉ có thể thêm tối đa 2 tags.');
            return;
        }
        if (!tempTags.includes(tag)) {
            setTempTags([...tempTags, tag]);
            setError(null);
        }
    };

    const handleDeleteTag = (tag: string) => {
        setTempTags(tempTags.filter(t => t !== tag));
        setError(null);
    };

    const handleSaveTags = () => {
        if (taggingImage) {
            handleUpdateTags(taggingImage.publicId, tempTags);
            setTaggingImage(null);
            setTempTags([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTagInput.trim() !== '') {
            handleAddTag(newTagInput.trim());
            setNewTagInput('');
        }
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)', // 2 cột trên mobile
                    sm: 'repeat(3, 1fr)', // 3 cột trên tablet
                    md: 'repeat(4, 1fr)', // 4 cột trên desktop
                    lg: 'repeat(5, 1fr)', // 5 cột trên màn hình lớn
                },
            }}
        >
            <AnimatePresence>
                {images.map((image) => (
                    <motion.div
                        key={image.publicId}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={getExitAnimation(image.isActioned)}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'relative',
                            cursor: isCoupleMode ? 'pointer' : 'default',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            opacity: image.status === 'Bị ẩn' ? 0.4 : 1,
                            border: selectedPublicIds.has(image.publicId) ? '2px solid white' : 'none',
                        }}
                        onClick={() => isCoupleMode && handleToggleSelection(image.publicId)}
                    >
                        <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden' }}>
                            <Box
                                component="img"
                                src={image.url}
                                alt={`Ảnh cưới ${image.publicId}`}
                                loading="lazy"
                                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* Overlay loading khi đang cập nhật */}
                            {image.isUpdating && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 10
                                }}>
                                    <CircularProgress sx={{ color: 'white' }} />
                                </Box>
                            )}

                            {isCoupleMode && (
                                <>
                                    {/* Hiển thị tags */}
                                    {image.tags && image.tags.length > 0 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            zIndex: 1,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 0.5,
                                        }}>
                                            {image.tags.map(tag => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                                                        color: 'black',
                                                        fontWeight: 'bold',
                                                        fontSize: { xs: '0.6rem', md: '0.75rem' }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    {/* <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                                        <Checkbox
                                            checked={selectedPublicIds.has(image.publicId)}
                                            onChange={(e) => { e.stopPropagation(); handleToggleSelection(image.publicId); }}
                                            sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                        />
                                    </Box> */}

                                    {/* Các nút hành động được gom lại trong một Stack */}
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            zIndex: 1,
                                        }}
                                    >
                                        <Tooltip title="Gắn tag">
                                            <IconButton size="small" sx={{ color: 'white' }} onClick={(e) => handleOpenTagDialog(e, image)}>
                                                <LocalOfferIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleFavorite(image.publicId, !image.isFavorite); }}>
                                            {image.isFavorite ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
                                        </IconButton>
                                        <Tooltip title="Xem toàn màn hình">
                                            <IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); setFullscreenImage(image); }}>
                                                <FullscreenIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </>
                            )}

                            {/* Action overlay - chỉ hiển thị khi không loading */}
                            {isCoupleMode && image.status === 'Đang chờ duyệt' && !image.isUpdating && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    opacity: 1,
                                    transition: 'opacity 0.3s'
                                }}>
                                    <Tooltip title="Duyệt ảnh">
                                        <IconButton
                                            sx={{ color: 'green', fontSize: 60 }}
                                            onClick={(e) => { e.stopPropagation(); handleModerationSingle(image.publicId, 'approve'); }}
                                        >
                                            <CheckCircleOutlineIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Ẩn ảnh">
                                        <IconButton
                                            sx={{ color: 'red', fontSize: 60, ml: 2 }}
                                            onClick={(e) => { e.stopPropagation(); handleModerationSingle(image.publicId, 'reject'); }}
                                        >
                                            <HighlightOffIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Tagging Dialog */}
            <Dialog open={taggingImage !== null} onClose={() => setTaggingImage(null)}>
                <DialogTitle>Gắn thẻ cho ảnh</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Chọn từ các thẻ gợi ý:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {predefinedTags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => handleAddTag(tag)}
                                    color={tempTags.includes(tag) ? 'primary' : 'default'}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>Tags đã thêm:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {tempTags?.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                    color="secondary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Thêm tag mới"
                        type="text"
                        fullWidth
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTaggingImage(null)}>Hủy</Button>
                    <Button onClick={handleSaveTags} variant="contained" color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PhotoGrid;