import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Stack,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PendingIcon from '@mui/icons-material/Pending';
import { ModerationAction, Photo, PhotoActioned } from '../PhotoAlbum';
import { AnimatePresence, motion } from 'framer-motion';

interface PhotoListProps {
    images: Photo[];
    selectedPublicIds: Set<string>;
    handleToggleSelection: (publicId: string) => void;
    handleModerationSingle: (publicId: string, action: ModerationAction) => void;
    handleToggleFavorite: (publicId: string, isFavorite: boolean) => Promise<void>;
    handleUpdateTags: (publicId: string, newTags: string[]) => Promise<void>;
    handleUpdateCategory: (publicId: string, category: string) => Promise<void>;
    setFullscreenImage: (image: Photo | null) => void;
    isCoupleMode: boolean;
}

const getExitAnimation = (actionType?: PhotoActioned) => {
    switch (actionType) {
        case 'approved':
            return { opacity: 1, x: 0 };
        case 'rejected':
            return { opacity: 0, scale: 0.8, transition: { duration: 0.5 } };
        case 'deleted':
            return { opacity: 0, x: -100, transition: { duration: 0.5 } };
        default:
            return { opacity: 0, scale: 0.8, transition: { duration: 0.3 } };
    }
};

const predefinedTags = ['Bạn thân', 'Gia đình', 'Người quen', 'Đồng nghiệp'];

const PhotoList: React.FC<PhotoListProps> = ({
    images,
    selectedPublicIds,
    handleToggleSelection,
    handleModerationSingle,
    handleToggleFavorite,
    handleUpdateTags,
    handleUpdateCategory,
    setFullscreenImage,
    isCoupleMode,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [taggingImage, setTaggingImage] = useState<Photo | null>(null);
    const [categoryingImage, setCategoryingImage] = useState<Photo | null>(null);
    const [newTagInput, setNewTagInput] = useState('');
    const [tempTags, setTempTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleOpenTagDialog = (image: Photo) => {
        setTaggingImage(image);
        setTempTags(image.tags || []);
        setNewTagInput('');
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

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'Hiển thị':
                return <Chip label="Đã duyệt" size="small" icon={<CheckCircleOutlineIcon fontSize="small" />} color="success" sx={{ px: 0.5, fontWeight: 'bold' }} />;
            case 'Đang chờ duyệt':
                return <Chip label="Đang chờ duyệt" size="small" icon={<PendingIcon fontSize="small" />} color="warning" sx={{ px: 0.5, fontWeight: 'bold' }} />;
            case 'Bị ẩn':
                return <Chip label="Bị ẩn" size="small" icon={<VisibilityOffIcon fontSize="small" />} color="info" sx={{ px: 0.5, fontWeight: 'bold' }} />;
            case 'Đã xóa':
                return <Chip label="Đã xóa" size="small" icon={<DeleteIcon fontSize="small" />} color="error" sx={{ px: 0.5, fontWeight: 'bold' }} />;
            default:
                return <Chip label={status} size="small" color="default" sx={{ px: 0.5 }} />;
        }
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ bgcolor: 'black', color: 'white' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Ảnh</TableCell>
                            <TableCell sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Trạng thái</TableCell>
                            {!isMobile && (
                                <>
                                    <TableCell sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Yêu thích</TableCell>
                                    <TableCell sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Tags</TableCell>
                                </>
                            )}
                            {isCoupleMode && images.some(image => image.status === 'Đang chờ duyệt') && (
                                <TableCell sx={{ bgcolor: 'black', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Hành động</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <AnimatePresence>
                        <TableBody>
                            {images.map((image) => (
                                <motion.tr
                                    key={image.publicId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={getExitAnimation(image.isActioned)}
                                    transition={{ duration: 0.5 }}
                                    style={{ 
                                        position: 'relative',
                                        opacity: image.status === 'Bị ẩn' ? 0.4 : 1,
                                        backgroundColor: selectedPublicIds.has(image.publicId) ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    }}
                                >
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {isCoupleMode && (
                                                <Checkbox
                                                    checked={selectedPublicIds.has(image.publicId)}
                                                    onChange={() => handleToggleSelection(image.publicId)}
                                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                                />
                                            )}
                                            <Box
                                                sx={{
                                                    width: 120,
                                                    height: 150,
                                                    overflow: 'hidden',
                                                    borderRadius: '8px',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    },
                                                }}
                                                onClick={() => setFullscreenImage(image)}
                                            >
                                                <Box
                                                    component="img"
                                                    src={image.url}
                                                    alt={`Ảnh cưới ${image.publicId}`}
                                                    loading="lazy"
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}>
                                                    <Tooltip title="Xem toàn màn hình">
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setFullscreenImage(image); }}>
                                                            <FullscreenIcon sx={{ color: 'white', fontSize: '1rem' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        {getStatusChip(image.status)}
                                    </TableCell>
                                    {!isMobile && (
                                        <>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                {isCoupleMode && (
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleFavorite(image.publicId, !image.isFavorite); }}>
                                                        {image.isFavorite ? <FavoriteIcon sx={{ color: '#ff6363' }} /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                    {image.tags?.map(tag => (
                                                        <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'grey.800', color: 'white', fontWeight: 'bold' }} />
                                                    ))}
                                                    {isCoupleMode && (
                                                        <Tooltip title="Gắn tag">
                                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenTagDialog(image); }}>
                                                                <LocalOfferIcon sx={{ color: 'white' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </>
                                    )}
                                    {isCoupleMode && image.status === 'Đang chờ duyệt' && (
                                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Tooltip title="Duyệt">
                                                    <IconButton size="small" onClick={() => handleModerationSingle(image.publicId, 'approve')} sx={{ color: 'green' }}>
                                                        <CheckCircleOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Ẩn">
                                                    <IconButton size="small" onClick={() => handleModerationSingle(image.publicId, 'reject')} sx={{ color: 'red' }}>
                                                        <HighlightOffIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    )}
                                </motion.tr>
                            ))}
                        </TableBody>
                    </AnimatePresence>
                </Table>
            </TableContainer>

            {/* Tagging Dialog */}
            <Dialog open={taggingImage !== null} onClose={() => setTaggingImage(null)} PaperProps={{ sx: { bgcolor: 'black', color: 'white' } }}>
                <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Gắn thẻ cho ảnh</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'grey.400' }}>Chọn từ các thẻ gợi ý:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {predefinedTags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onClick={() => handleAddTag(tag)}
                                    color={tempTags.includes(tag) ? 'primary' : 'default'}
                                    sx={{ color: tempTags.includes(tag) ? 'white' : 'grey.300', bgcolor: tempTags.includes(tag) ? '#ff6363' : 'grey.800' }}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'grey.400' }}>Tags đã thêm:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {tempTags?.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                    color="secondary"
                                    variant="filled"
                                    sx={{ bgcolor: '#ff6363', color: 'white' }}
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
                        sx={{ mt: 2, '& .MuiInputBase-input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.600' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.400' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6363' }, '& .MuiInputLabel-root': { color: 'grey.400' }, '&.Mui-focused .MuiInputLabel-root': { color: '#ff6363' } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTaggingImage(null)} sx={{ color: 'grey.500' }}>Hủy</Button>
                    <Button onClick={handleSaveTags} variant="contained" color="primary" sx={{ bgcolor: '#ff6363', '&:hover': { bgcolor: '#ff4d4d' } }}>Lưu</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default PhotoList;