import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Alert, Card, CardContent,
    Pagination, Container, Fade,
    LinearProgress, linearProgressClasses,
    Modal, IconButton,
    Grid
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { varAlpha } from 'src/theme/styles';
import Masonry from '@mui/lab/Masonry';
import { ApiResponse, GuestbookEntry } from 'src/types/data';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { weddingData } from './weddingData';

const APPS_SCRIPT_URL = weddingData.GOOGLE_SHEETS_RSVP;

const renderFallback = () => (
    <Box
        sx={{
            display: 'flex', flex: '1 1 auto', alignItems: 'center',
            justifyContent: 'center', height: '50vh',
        }}
    >
        <LinearProgress
            sx={{
                width: 1, maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

const GuestbookCard = styled(Card)(({ theme }) => ({
    minHeight: 150, cursor: 'pointer',
    border: `1px solid ${theme.palette.grey[200]}`,
    boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
    borderRadius: 12, position: 'relative',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s',
    '&:hover': {
        transform: 'translate(-3px, -3px) rotate(1deg)',
        boxShadow: '6px 6px 12px rgba(0,0,0,0.15)',
    },
}));

// Tùy chỉnh màu sắc nền cho từng lời chúc
const cardBackgroundColors = [
    '#FCE4EC', // Pink pastel
    '#E1F5FE', // Blue pastel
    '#E8F5E9', // Green pastel
    '#FFF3E0', // Orange pastel
    '#EFEBE9', // Brown pastel
];

const Guestbook: React.FC = () => {
    const theme = useTheme();
    const [messages, setMessages] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const messagesPerPage = 10;

    // NEW: Trạng thái cho Popup
    const [openModal, setOpenModal] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${APPS_SCRIPT_URL}?type=guestbook`);
                const result: ApiResponse<{ entries: GuestbookEntry[] }> = await response.json();

                if (result.success) {
                    setMessages(result.data.entries.reverse());
                } else {
                    setError(result.message || 'Không thể tải sổ lời chúc.');
                }
            } catch (err) {
                setError('Không thể tải sổ lời chúc. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const totalPages = Math.ceil(messages.length / messagesPerPage);
    const currentMessages = useMemo(() => {
        const startIndex = (page - 1) * messagesPerPage;
        return messages.slice(startIndex, startIndex + messagesPerPage);
    }, [page, messages, messagesPerPage]);

    const totalMessages = messages.length;
    const uniqueSenders = new Set(messages.map(msg => msg.tênngườigửi)).size;
    // Updated to get sender's name instead of date
    const firstMessageSender = totalMessages > 0 ? messages[totalMessages - 1].tênngườigửi : 'Chưa có';
    const lastMessageSender = totalMessages > 0 ? messages[0].tênngườigửi : 'Chưa có';

    // NEW: Hàm xử lý mở popup
    const handleCardClick = (index: number) => {
        const globalIndex = ((page - 1) * messagesPerPage) + index;
        setSelectedCardIndex(globalIndex);
        setOpenModal(true);
    };

    // NEW: Hàm xử lý đóng popup
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCardIndex(null);
    };

    // NEW: Hàm chuyển thiệp
    const handleNext = () => {
        if (selectedCardIndex !== null && selectedCardIndex < totalMessages - 1) {
            setSelectedCardIndex(selectedCardIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (selectedCardIndex !== null && selectedCardIndex > 0) {
            setSelectedCardIndex(selectedCardIndex - 1);
        }
    };

    const isLastCard = selectedCardIndex === totalMessages - 1;
    const isFirstCard = selectedCardIndex === 0;

    if (loading) return renderFallback();
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            {/* ... (Tiêu đề và phần thống kê) ... */}
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" fontWeight="bold" color={theme.palette.primary.main} sx={{ textAlign: 'left', fontFamily: "'Oooh Baby', cursive", letterSpacing: 2 }}>
                    Sổ Lưu Bút
                </Typography>
                <Typography sx={{ textAlign: 'left' }} variant="h6" color="text.secondary" fontStyle="italic">
                    Những lời chúc chân thành từ bạn bè và người thân
                </Typography>
                <Box
                    sx={{
                        mt: 3, mb: 4, p: 2, borderRadius: 2,
                        border: '1px dashed', borderColor: 'divider',
                    }}
                >
                    <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                        <Grid item xs={6} md={6}>
                            <Box textAlign="center">
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                    {totalMessages}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng số lời chúc
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Box textAlign="center">
                                <Typography variant="h5" color="text.primary" fontWeight="bold">
                                    {lastMessageSender}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Lời chúc gần nhất
                                </Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>

            </Box>

            {currentMessages.length > 0 ? (
                <Masonry columns={{ xs: 2, sm: 2, md: 3 }} spacing={1} sx={{ margin: 0 }}>
                    {currentMessages.map((msg, index) => {
                        const cardColor = cardBackgroundColors[index % cardBackgroundColors.length];
                        const rotate = (Math.random() - 0.5) * 5;
                        return (
                            <Fade in={true} timeout={500 + index * 100} key={index}>
                                <GuestbookCard
                                    onClick={() => handleCardClick(index)} // Thêm sự kiện click
                                    sx={{
                                        bgcolor: cardColor,
                                        transform: `rotate(${rotate}deg)`,
                                        '&:hover': { transform: `rotate(0deg) scale(1.03)` },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            <Typography component="span" fontWeight="bold">Tên người gửi:</Typography> {msg.tênngườigửi}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <Typography component="span" fontWeight="bold">Thời gian:</Typography> {new Date(msg.thờigian).toLocaleString('vi-VN')}
                                        </Typography>
                                        <Typography
                                            sx={{ mt: 2, fontFamily: "'Playfair Display', cursive", fontSize: '0.75rem', fontWeight: 400, letterSpacing: 1 }}
                                        >
                                            <Typography component="h3" fontWeight="bold" sx={{ fontFamily: "'Oooh Baby', cursive", display: 'block', mb: 1, color: 'primary.main' }}>Lời chúc:</Typography>
                                            {msg.lờichúc}
                                        </Typography>
                                    </CardContent>
                                </GuestbookCard>
                            </Fade>
                        );
                    })}
                </Masonry>
            ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Chưa có lời chúc nào được gửi.
                </Alert>
            )}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                    />
                </Box>
            )}

            {/* --- NEW: Popup Modal Component --- */}
            {selectedCardIndex !== null && (
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="card-modal-title"
                    aria-describedby="card-modal-description"
                    closeAfterTransition
                    sx={{
                        p: 4,
                        // Thay vì nền trắng, sử dụng gradient hoặc màu pastel
                        boxShadow: 24,
                        borderRadius: 2,
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(5px)',
                    }}
                >
                    <Fade in={openModal}>
                        <Box sx={{
                            position: 'relative',
                            p: 4, bgcolor: 'background.paper',
                            boxShadow: 24, borderRadius: 2,
                            width: { xs: '90%', sm: '70%', md: '50%' },
                            maxHeight: '90vh', overflowY: 'auto',
                            outline: 'none',
                        }}>
                            <IconButton
                                sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
                                onClick={handleCloseModal}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Box mb={2} sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    sx={{
                                        fontFamily: "'Oooh Baby', cursive",
                                        color: 'primary.main',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)' // Thêm hiệu ứng nổi
                                    }}
                                >
                                    {messages[selectedCardIndex]?.tênngườigửi}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mt: 1 }}>
                                    {messages[selectedCardIndex]?.thờigian && new Date(messages[selectedCardIndex].thờigian).toLocaleString('vi-VN')}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                    lineHeight: 1.8,
                                    color: 'text.primary'
                                }}
                            >
                                {messages[selectedCardIndex]?.lờichúc}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <IconButton onClick={handlePrevious} disabled={isFirstCard}>
                                    <ArrowBackIosNewIcon />
                                </IconButton>
                                <IconButton onClick={handleNext} disabled={isLastCard}>
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            )}
        </Container>
    );
};

export default Guestbook;