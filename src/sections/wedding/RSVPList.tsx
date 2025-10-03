import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, CircularProgress, Alert, Container, Pagination,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Grid, Card, CardContent, useMediaQuery, useTheme, Chip, Button,
    LinearProgress, linearProgressClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { varAlpha } from 'src/theme/styles'; // Giả định
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ApiResponse, RsvpEntry } from 'src/types/data';
import { Navigate, useNavigate } from 'react-router-dom';
import { weddingData } from './weddingData';

const APPS_SCRIPT_URL = weddingData.GOOGLE_SHEETS_RSVP;

// Hàm render fallback
const renderFallback = () => (
    <Box
        sx={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh', // Chiều cao để loading ở giữa màn hình
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

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
}));
interface SummaryCardProps {
    title: string;
    value: number;
    color: string;
}
const SummaryCard = ({ title, value, color }: SummaryCardProps) => (
    <Card sx={{ textAlign: 'center', p: 2, bgcolor: `${color}.lighter`, color: `${color}.darker`, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold">{value}</Typography>
        <Typography sx={{ mt: 1, opacity: 0.8, fontSize: "0.75rem" }}>{title}</Typography>
    </Card>
);

const RSVPList: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const rsvpsPerPage = 10;
    const maxMessageLength = 50;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRsvps = async () => {
            try {
                const response = await fetch(`${APPS_SCRIPT_URL}?type=rsvp`);
                const result: ApiResponse<{ entries: RsvpEntry[] }> = await response.json();

                if (result.success) {
                    setRsvps(result.data.entries.reverse());
                } else {
                    setError(result.message || 'Không thể tải danh sách xác nhận.');
                }
            } catch (err) {
                setError('Không thể tải danh sách xác nhận. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        fetchRsvps();
    }, []);

    const totalPages = Math.ceil(rsvps.length / rsvpsPerPage);
    const currentRsvps = useMemo(() => {
        const startIndex = (page - 1) * rsvpsPerPage;
        return rsvps.slice(startIndex, startIndex + rsvpsPerPage);
    }, [page, rsvps, rsvpsPerPage]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const totalRsvps = rsvps.length;
    const attendingRsvps = rsvps.filter(rsvp => rsvp.trạngtháithamgia === 'Có, tôi sẽ đến').length;
    const declinedRsvps = rsvps.filter(rsvp => rsvp.trạngtháithamgia === 'Không, rất tiếc').length;
    const totalGuests = rsvps.reduce((sum, rsvp) => sum + (rsvp.trạngtháithamgia === 'Có, tôi sẽ đến' ? rsvp.sốkhách : 0), 0);

    const formatMessage = (message: string) => {
        if (message.length > maxMessageLength) {
            return `${message.substring(0, maxMessageLength)}...`;
        }
        return message;
    };

    // Logic render có điều kiện
    if (loading) {
        return renderFallback();
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // Hàm render giao diện Table (cho PC)
    const renderTable = () => (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
            <Table>
                <StyledTableHead>
                    <TableRow>
                        {/* <TableCell><Typography fontWeight="bold">Thời Gian</Typography></TableCell> */}
                        <TableCell><Typography fontWeight="bold">Họ và Tên</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">Khách của Ai</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="bold">Số khách tham dự (khách mời + khách đi cùng)</Typography></TableCell>
                        <TableCell><Typography fontWeight="bold">Trạng Thái</Typography></TableCell>
                        {/* <TableCell><Typography fontWeight="bold">Lời Nhắn</Typography></TableCell> */}
                    </TableRow>
                </StyledTableHead>
                <TableBody>
                    {currentRsvps.length > 0 ? (
                        currentRsvps.map((rsvp, index) => (
                            <TableRow key={index} sx={{ bgcolor: index % 2 === 0 ? 'background.paper' : theme.palette.action.hover }}>
                                {/* <TableCell>{new Date(rsvp.thờigian).toLocaleString('vi-VN')}</TableCell> */}
                                <TableCell>{rsvp.họvàtên}</TableCell>
                                <TableCell>{rsvp.kháchcủaai}</TableCell>
                                <TableCell align="right">{rsvp.sốkhách === 0 ? "0" : `${rsvp.sốkhách} người`}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={rsvp.trạngtháithamgia}
                                        size="small"
                                        color={rsvp.trạngtháithamgia === 'Có, tôi sẽ đến' ? 'success' : 'error'}
                                        icon={rsvp.trạngtháithamgia === 'Có, tôi sẽ đến' ? <CheckCircleIcon /> : <CancelIcon />}
                                    />
                                </TableCell>
                                {/* <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{formatMessage(rsvp.lờinhắn)}</TableCell> */}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography variant="body2" color="text.secondary">Chưa có ai xác nhận tham gia.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // Hàm render giao diện Cards (cho Mobile)
    const renderCards = () => (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {currentRsvps.length > 0 ? (
                currentRsvps.map((rsvp, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ boxShadow: 2, borderLeft: `5px solid ${rsvp.trạngtháithamgia === 'Có, tôi sẽ đến' ? theme.palette.success.main : theme.palette.error.main}` }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        {rsvp.họvàtên}
                                    </Typography>
                                    <Chip
                                        label={rsvp.trạngtháithamgia}
                                        size="small"
                                        color={rsvp.trạngtháithamgia === 'Có, tôi sẽ đến' ? 'success' : 'error'}
                                        icon={rsvp.trạngtháithamgia === 'Có, tôi sẽ đến' ? <CheckCircleIcon /> : <CancelIcon />}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Khách của:</strong> {rsvp.kháchcủaai}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Số khách tham dự (khách mời + khách đi cùng):</strong> {rsvp.sốkhách}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Ngày xác nhận:</strong> {new Date(rsvp.thờigian).toLocaleDateString('vi-VN')}
                                </Typography>
                                {rsvp.lờinhắn && (
                                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                                        "{formatMessage(rsvp.lờinhắn)}"
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Chưa có ai xác nhận tham gia.
                    </Alert>
                </Grid>
            )}
        </Grid>
    );

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center" sx={{
                fontFamily: "'Oooh Baby', cursive",
            }}>
                Danh Sách Xác Nhận Tham Gia
            </Typography>

            {/* Phần tổng quan */}
            <Grid container spacing={1} sx={{ my: 3 }}>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard title="Tổng Số Xác Nhận" value={totalRsvps} color="primary" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard title="Khách Đồng Ý" value={attendingRsvps} color="success" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard title="Khách Từ Chối" value={declinedRsvps} color="error" />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <SummaryCard title="Tổng Số Khách Dự Kiến Tham Dự" value={totalGuests} color="info" />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/guestbook')}
                >
                    Xem Lời Chúc
                </Button>
            </Box>

            {isMobile ? renderCards() : renderTable()}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
};

export default RSVPList;