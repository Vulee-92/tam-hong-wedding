// components/PhotoAlbum.tsx
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Fab, Chip, Tabs, Tab, Tooltip, Stack, ToggleButton, ToggleButtonGroup, MenuItem, Select, FormControl, InputLabel, useTheme, useMediaQuery, IconButton } from '@mui/material'; // Thêm useTheme, useMediaQuery
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AnimatePresence, motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Slideshow from './Slideshow';
import { AudioProvider } from 'src/context/AudioContext';
import FullscreenViewer from './components/FullscreenViewer';
import PhotoGrid from './components/PhotoGrid';
import PhotoList from './components/PhotoList';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_ZjSoVgefWAEqjva4FTs0jKtokxnHkMRdcjlmMWTEu0t-h9x-yYW6QJPy4dBPeQRS/exec';

export type PhotoStatus = 'Hiển thị' | 'Đang chờ duyệt' | 'Bị ẩn' | 'Đã xóa';
export type PhotoActioned = 'approved' | 'rejected' | 'deleted';
export type ViewMode = 'grid' | 'list';
export type ModerationAction = 'approve' | 'reject' | 'delete';
export type BatchModerationAction = 'approve_multiple' | 'reject_multiple' | 'delete_multiple';

export interface Photo {
    url: string;
    publicId: string;
    createdAt: string;
    status: PhotoStatus;
    isUpdating?: boolean;
    isActioned?: PhotoActioned;
    isFavorite?: boolean;
    tags?: string[];
    category?: string;
}

interface ApiResponse {
    images?: { url: string; publicId: string; createdAt: string; status: string; isFavorite?: boolean; tags?: string[]; category?: string; }[];
    urls?: string[];
    publicIds?: string[];
    createdAts?: string[];
}

const PhotoAlbum: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [images, setImages] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
    const [isCoupleMode, setIsCoupleMode] = useState(false);
    const [selectedPublicIds, setSelectedPublicIds] = useState<Set<string>>(new Set());
    const [filterStatus, setFilterStatus] = useState<PhotoStatus | 'Tất cả' | 'Yêu thích'>('Tất cả');
    const [filterCategory, setFilterCategory] = useState<string>('Tất cả');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [fullscreenImage, setFullscreenImage] = useState<Photo | null>(null);

    const localStorageKey = 'weddingPhotoAlbum';

    const fetchImagesFromApi = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const isCouple = urlParams.get('mode') === 'couple';
            setIsCoupleMode(isCouple);

            const fetchUrl = isCouple
                ? `${APPS_SCRIPT_URL}?mode=couple`
                : APPS_SCRIPT_URL;

            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: ApiResponse = await response.json();

            const typedImages: Photo[] = (data.images || []).map(img => ({
                url: img.url,
                publicId: img.publicId,
                createdAt: img.createdAt,
                status: img.status as PhotoStatus,
                isFavorite: img.isFavorite || false,
                tags: img.tags || [],
                category: img.category || '',
            }));

            if (!isCouple) {
                const publicImages: Photo[] = (data.urls || []).map((url, index) => ({
                    url,
                    publicId: (data.publicIds && data.publicIds[index]) || '',
                    createdAt: (data.createdAts && data.createdAts[index]) || '',
                    status: 'Hiển thị',
                    isFavorite: false,
                    tags: [],
                    category: '',
                }));
                setImages(publicImages);
                localStorage.setItem(localStorageKey, JSON.stringify(publicImages));
            } else {
                setImages(typedImages);
                localStorage.setItem(localStorageKey, JSON.stringify(typedImages));
            }

        } catch (err) {
            console.error("Lỗi khi tải ảnh từ API:", err);
            setError("Không thể tải ảnh. Vui lòng kiểm tra lại URL Apps Script và quyền truy cập.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSingleImage = async (publicId: string, updates: Partial<Photo>, successMessage: string) => {
        setImages(prevImages => prevImages.map(img =>
            img.publicId === publicId ? { ...img, isUpdating: true } : img
        ));

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=update&publicId=${publicId}&updates=${encodeURIComponent(JSON.stringify(updates))}`
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật trạng thái.');
            }

            setImages(prevImages => prevImages.map(img =>
                img.publicId === publicId ? { ...img, ...updates, isUpdating: false } : img
            ));

            setMessage(successMessage);
            setTimeout(() => {
                setMessage(null);
            }, 2000);
        } catch (err) {
            console.error(err);
            setMessage('Lỗi khi xử lý yêu cầu.');
            setImages(prevImages => prevImages.map(img =>
                img.publicId === publicId ? { ...img, isUpdating: false } : img
            ));
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleModerationSingle = (publicId: string, action: ModerationAction) => {
        const newStatus = action === 'approve' ? 'Hiển thị' : action === 'reject' ? 'Bị ẩn' : 'Đã xóa';
        const actionType = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'deleted';
        const successMessage = `Ảnh đã được ${newStatus === 'Hiển thị' ? 'phê duyệt' : newStatus === 'Bị ẩn' ? 'từ chối' : 'xóa'}.`;

        handleUpdateSingleImage(publicId, { status: newStatus, isActioned: actionType }, successMessage);
    };

    const handleToggleFavorite = async (publicId: string, isFavorite: boolean) => {
        const successMessage = `Ảnh đã được ${isFavorite ? 'thả tim' : 'bỏ tim'}.`;
        await handleUpdateSingleImage(publicId, { isFavorite }, successMessage);
    };

    const handleUpdateTags = async (publicId: string, newTags: string[]) => {
        const successMessage = 'Đã lưu tags thành công!';
        await handleUpdateSingleImage(publicId, { tags: newTags }, successMessage);
    };

    const handleUpdateCategory = async (publicId: string, category: string) => {
        const successMessage = 'Đã cập nhật danh mục thành công!';
        await handleUpdateSingleImage(publicId, { category }, successMessage);
    };

    const handleModerationBatch = async (action: BatchModerationAction) => {
        if (selectedPublicIds.size === 0) {
            setMessage('Vui lòng chọn ít nhất một ảnh.');
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setMessage('Đang xử lý...');
        setImages(prevImages => prevImages.map(img =>
            selectedPublicIds.has(img.publicId) ? { ...img, isUpdating: true } : img
        ));

        try {
            const publicIdsArray = Array.from(selectedPublicIds);
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=${action}&publicIds=${JSON.stringify(publicIdsArray)}`
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật trạng thái.');
            }

            const newStatus = action === 'approve_multiple' ? 'Hiển thị' : action === 'reject_multiple' ? 'Bị ẩn' : 'Đã xóa';
            const actionType = action === 'approve_multiple' ? 'approved' : action === 'reject_multiple' ? 'rejected' : 'deleted';

            setImages(prevImages => prevImages.map(img =>
                selectedPublicIds.has(img.publicId) ? { ...img, status: newStatus, isUpdating: false, isActioned: actionType } : img
            ));

            setSelectedPublicIds(new Set());

            setMessage(`Đã cập nhật trạng thái cho ${publicIdsArray.length} ảnh.`);
            setTimeout(() => {
                setMessage(null);
                setImages(prevImages => prevImages.map(img =>
                    publicIdsArray.includes(img.publicId) ? { ...img, isActioned: undefined } : img
                ));
            }, 1000);
        } catch (err) {
            console.error(err);
            setMessage('Lỗi khi xử lý yêu cầu.');
            setImages(prevImages => prevImages.map(img =>
                selectedPublicIds.has(img.publicId) ? { ...img, isUpdating: false } : img
            ));
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleToggleSelection = (publicId: string) => {
        setSelectedPublicIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(publicId)) {
                newIds.delete(publicId);
            } else {
                newIds.add(publicId);
            }
            return newIds;
        });
    };

    const handleDownload = async () => {
        if (selectedPublicIds.size === 0 || selectedPublicIds.size === 1) {
            setMessage(selectedPublicIds.size === 0 ? 'Vui lòng chọn ảnh để tải xuống.' : 'Vui lòng chọn thêm 1 ảnh nữa!');
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setMessage('Đang chuẩn bị file tải xuống...');
        try {
            const selectedImages = images.filter(img => selectedPublicIds.has(img.publicId));
            if (selectedImages.length === 1) {
                const image = selectedImages[0];
                const link = document.createElement('a');
                link.href = image.url;
                link.download = `${image.publicId}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const zip = new JSZip();
                const promises = selectedImages.map(async (image) => {
                    const response = await fetch(image.url);
                    const blob = await response.blob();
                    zip.file(`${image.publicId}.jpg`, blob);
                });
                await Promise.all(promises);
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    saveAs(content, 'wedding_photos.zip');
                });
            }
            setMessage('Tải xuống thành công!');
        } catch (err) {
            console.error(err);
            setMessage('Lỗi khi tải xuống ảnh.');
        }
        setTimeout(() => setMessage(null), 3000);
    };

    // Hàm mới: Tải xuống một ảnh duy nhất
    const handleDownloadSingleImage = async (image: Photo) => {
        setMessage('Đang tải ảnh...');
        try {
            const link = document.createElement('a');
            link.href = image.url;
            link.download = `${image.publicId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setMessage('Tải xuống thành công!');
        } catch (err) {
            console.error(err);
            setMessage('Lỗi khi tải xuống ảnh.');
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleViewModeChange = (
        event: React.MouseEvent<HTMLElement>,
        newViewMode: ViewMode | null,
    ) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
        }
    };

    useEffect(() => {
        const cachedData = localStorage.getItem(localStorageKey);
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                if (Array.isArray(parsedData)) {
                    const typedData: Photo[] = parsedData.map(item => ({
                        url: item.url,
                        publicId: item.publicId,
                        createdAt: item.createdAt,
                        status: item.status as PhotoStatus,
                        isFavorite: item.isFavorite || false,
                        tags: item.tags || [],
                        category: item.category || '',
                    }));
                    setImages(typedData);
                }
            } catch (e) {
                console.error("Failed to parse localStorage data", e);
                localStorage.removeItem(localStorageKey);
            }
            setIsLoading(false);
        }
        fetchImagesFromApi();
    }, []);


    // const filteredImages = images.filter(img => {
    //     const statusMatch = filterStatus === 'Tất cả' ? (img.status === 'Hiển thị' || img.status === 'Đang chờ duyệt') : img.status === filterStatus;
    //     const categoryMatch = filterCategory === 'Tất cả' ? true : img.category === filterCategory;
    //     return statusMatch && categoryMatch;
    // });
    const filteredImages = images.filter(img => {
        // Điều chỉnh logic lọc trạng thái
        const statusMatch = (() => {
            if (filterStatus === 'Tất cả') {
                return img.status === 'Hiển thị' || img.status === 'Đang chờ duyệt';
            }
            if (filterStatus === 'Yêu thích') {
                // Chỉ lấy ảnh yêu thích có trạng thái là 'Hiển thị' hoặc 'Đang chờ duyệt'
                return img.isFavorite && (img.status === 'Hiển thị' || img.status === 'Đang chờ duyệt');
            }
            return img.status === filterStatus;
        })();

        // Logic lọc danh mục
        const categoryMatch = filterCategory === 'Tất cả' ? true : img.category === filterCategory;

        return statusMatch && categoryMatch;
    });
    if (isLoading && images.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'black', color: 'white' }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>Đang tải album...</Typography>
            </Box>
        );
    }
    if (error && images.length === 0) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'black' }}>
                <Box sx={{ p: 3, textAlign: 'center', color: 'error.main', bgcolor: 'rgba(255, 179, 179, 0.1)', borderLeft: '4px solid', borderColor: 'error.main', borderRadius: '8px' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Lỗi Đã Xảy Ra!</Typography>
                    <Typography sx={{ mt: 1 }}>{error}</Typography>
                </Box>
            </Box>
        );
    }
    if (images.length === 0 && !isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'black' }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>Không có ảnh nào trong album.</Typography>
            </Box>
        );
    }

    const approvedImages = images.filter(img => img.status === 'Hiển thị');

    return (
        <AudioProvider>
            <Box sx={{ bgcolor: 'black', minHeight: '100vh', position: 'relative' }}>
                {message && (
                    <Box sx={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', bgcolor: 'grey.800', color: 'white', py: 1, px: 2, borderRadius: '999px', boxShadow: 3, zIndex: 50 }}>
                        {message}
                    </Box>
                )}
                {isSlideshowOpen && (
                    <Slideshow
                        imageUrls={approvedImages.map(img => img.url)}
                        initialIndex={0}
                        onClose={() => setIsSlideshowOpen(false)}
                    />
                )}
                {fullscreenImage && (
                    <FullscreenViewer
                        image={fullscreenImage}
                        onClose={() => setFullscreenImage(null)}
                        onDownload={() => handleDownloadSingleImage(fullscreenImage)}
                    />
                )}
                <Box sx={{ p: isMobile ? 1 : 2 }}>
                    {isCoupleMode && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'nowrap', // Prevent wrapping on mobile to enable horizontal scroll
                                    gap: 2,
                                    p: isMobile ? 1 : 2,
                                    overflow: 'hidden', // Hide the parts of the tabs that go outside the container
                                    position: 'relative',
                                    '&::before, &::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        zIndex: 1,
                                        pointerEvents: 'none',
                                        width: '30px',
                                        display: { xs: 'block', lg: 'none' },
                                    },
                                    '&::before': {
                                        left: 0,
                                        background: 'linear-gradient(to right, black, rgba(0,0,0,0))',
                                    },
                                    '&::after': {
                                        right: 0,
                                        background: 'linear-gradient(to left, black, rgba(0,0,0,0))',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', width: { xs: '100%', lg: 'auto' } }}>
                                    <Tabs
                                        value={filterStatus}
                                        onChange={(_, newValue) => setFilterStatus(newValue as PhotoStatus | 'Tất cả')}
                                        textColor="primary"
                                        indicatorColor="primary"
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        sx={{ width: '100%', '& .MuiTabs-scroller': { overflowX: 'auto' } }}
                                    >
                                        <Tooltip title="Làm mới album">
                                            <IconButton
                                                onClick={fetchImagesFromApi}
                                                disabled={isLoading}
                                                sx={{ color: 'white' }}
                                            >
                                                <RefreshIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tab label={<FavoriteIcon />} value="Yêu thích" sx={{ color: 'red', fontSize: isMobile ? '0.75rem' : '0.75rem' }} />
                                        <Tab label="Tất cả" value="Tất cả" sx={{ color: 'white', fontSize: isMobile ? '0.75rem' : '0.75rem' }} />
                                        <Tab label="Chờ duyệt" value="Chờ duyệt" sx={{ color: 'white', fontSize: isMobile ? '0.75rem' : '0.75rem' }} />
                                        <Tab label="Đã duyệt" value="Hiển thị" sx={{ color: 'white', fontSize: isMobile ? '0.75rem' : '0.75rem' }} />
                                        <Tab label="Bị ẩn" value="Bị ẩn" sx={{ color: 'white', fontSize: isMobile ? '0.75rem' : '0.75rem' }} />
                                        <Tab label="Đã xóa" value="Đã xóa" sx={{ color: 'red', fontSize: isMobile ? '0.75rem' : '0.75rem' }} />
                                    </Tabs>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-end' }}>

                                    {approvedImages.length > 0 && (
                                        <Button
                                            variant="contained"
                                            sx={{ display: { xs: "none", lg: "flex" } }}
                                            startIcon={<PlayCircleOutlineIcon />}
                                            onClick={() => setIsSlideshowOpen(true)}
                                            size={isMobile ? 'small' : 'medium'}
                                        >
                                            Trình chiếu
                                        </Button>
                                    )}
                                    <ToggleButtonGroup
                                        value={viewMode}
                                        exclusive
                                        onChange={handleViewModeChange}
                                        aria-label="view mode"
                                        sx={{ display: { xs: "none", lg: "block" } }}
                                        size={isMobile ? 'small' : 'medium'}
                                    >
                                        <ToggleButton value="grid" aria-label="grid view" sx={{ color: 'white' }}>
                                            <ViewModuleIcon />
                                        </ToggleButton>
                                        <ToggleButton value="list" aria-label="list view" sx={{ color: 'white' }}>
                                            <ViewListIcon />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Box>

                            <AnimatePresence>
                                {selectedPublicIds.size > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ position: 'fixed', bottom: isMobile ? 16 : 30, left: isMobile ? "10%" : "50%", transform: 'translateX(-50%)', zIndex: 100 }}
                                    >
                                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', p: isMobile ? 1 : 2, borderRadius: '999px', display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
                                            <Chip label={`${selectedPublicIds.size} ảnh đã chọn`} sx={{ color: 'white', bgcolor: 'grey.700' }} />
                                            {filterStatus !== 'Đã xóa' && (
                                                <>
                                                    <Tooltip title="Duyệt ảnh đã chọn">
                                                        <Fab size="small" color="primary" onClick={() => handleModerationBatch('approve_multiple')}>
                                                            <CheckCircleOutlineIcon />
                                                        </Fab>
                                                    </Tooltip>
                                                    <Tooltip title="Ẩn ảnh đã chọn">
                                                        <Fab size="small" color="secondary" onClick={() => handleModerationBatch('reject_multiple')}>
                                                            <HighlightOffIcon />
                                                        </Fab>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa ảnh đã chọn">
                                                        <Fab size="small" sx={{ bgcolor: 'red' }} onClick={() => handleModerationBatch('delete_multiple')}>
                                                            <DeleteForeverIcon sx={{ color: 'white' }} />
                                                        </Fab>
                                                    </Tooltip>
                                                    <Tooltip title="Tải xuống ảnh đã chọn">
                                                        <Fab size="small" sx={{ bgcolor: 'primary.main' }} onClick={handleDownload}>
                                                            <DownloadIcon sx={{ color: 'white' }} />
                                                        </Fab>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {filterStatus === 'Đã xóa' && (
                                                <Tooltip title="Khôi phục ảnh đã chọn">
                                                    <Fab size="small" color="primary" onClick={() => handleModerationBatch('approve_multiple')}>
                                                        <CheckCircleOutlineIcon />
                                                    </Fab>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                    {viewMode === 'grid' ? (
                        <PhotoGrid
                            images={filteredImages}
                            selectedPublicIds={selectedPublicIds}
                            handleToggleSelection={handleToggleSelection}
                            handleModerationSingle={handleModerationSingle}
                            handleToggleFavorite={handleToggleFavorite}
                            handleUpdateTags={handleUpdateTags}
                            setFullscreenImage={setFullscreenImage}
                            isCoupleMode={isCoupleMode}
                        />
                    ) : (
                        <PhotoList
                            images={filteredImages}
                            selectedPublicIds={selectedPublicIds}
                            handleToggleSelection={handleToggleSelection}
                            handleModerationSingle={handleModerationSingle}
                            handleToggleFavorite={handleToggleFavorite}
                            handleUpdateTags={handleUpdateTags}
                            handleUpdateCategory={handleUpdateCategory}
                            setFullscreenImage={setFullscreenImage}
                            isCoupleMode={isCoupleMode}
                        />
                    )}
                </Box>
            </Box>
        </AudioProvider>
    );
};

export default PhotoAlbum;