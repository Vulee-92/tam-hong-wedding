import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, Stack, Card, CardContent, TextField, Alert, CircularProgress,
    MenuItem, IconButton, Pagination,
    Paper, Divider, Fab, Drawer, useMediaQuery, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stepper, Step, StepLabel,
    Container, Skeleton,
    AlertTitle
} from '@mui/material';
import crypto from 'crypto-js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { styled } from '@mui/material/styles';
import { Guest } from 'src/types/linkguest';
import GuestTable from './GuestTable';
import { weddingData } from './weddingData';

type FilterStatus = 'all' | 'sent' | 'pending';

// Lấy URL của Google Apps Script từ biến môi trường
const APPS_SCRIPT_URL = weddingData.GOOGLE_SHEETS_LINK;

// Mật khẩu và thời gian hết hạn
const SECRET_PASSWORD_HASH = crypto.SHA256("070126").toString();
const AUTH_KEY = "wedding_guest_auth";
const CACHE_KEY = "wedding_guest_data";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 phút


const TotalGuestsCard = styled(Paper)<{ active: boolean }>(({ theme, active }) => ({
    flex: 1,
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid',
    borderColor: active ? theme.palette.primary.main : theme.palette.grey[300],
    backgroundColor: active ? theme.palette.primary.light : theme.palette.background.paper,
    color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: active ? theme.palette.primary.light : theme.palette.grey[100],
    },
}));

const steps = [
    {
        label: 'Giới thiệu',
        description: 'Chào mừng bạn đến với trang quản lý khách mời. Tại đây, bạn có thể thêm, sửa, xóa và theo dõi danh sách khách mời của mình.',
    },
    {
        label: 'Thêm Khách Mời',
        description: 'Nhấn vào nút "Thêm khách" hoặc biểu tượng dấu cộng để bắt đầu. Bạn có thể thêm từng khách một hoặc sử dụng chế độ "Thêm nhiều" để nhập danh sách nhanh chóng.',
    },
    {
        label: 'Quản lý & Chỉnh sửa',
        description: 'Sử dụng các biểu tượng trên bảng để chỉnh sửa thông tin hoặc xóa khách mời. Bạn cũng có thể thay đổi trạng thái "Đã gửi" hoặc "Chưa gửi".',
    },
    {
        label: 'Lọc & Tìm kiếm',
        description: 'Sử dụng các thẻ Tổng, Đã gửi, Chưa gửi để lọc danh sách. Dùng ô tìm kiếm để nhanh chóng tìm thấy khách mời cụ thể.',
    },
];

// --- Main Component ---
const WeddingStepGuests = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const urlPreview = 'https://tam-hong.vercel.app/';

    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State xác thực
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    // State cho form và chỉnh sửa
    const [newGuestName, setNewGuestName] = useState('');
    const [newGuestNote, setNewGuestNote] = useState('');
    const [newGuestType, setNewGuestType] = useState<'bride' | 'groom' | 'general' | 'parent'>('general');
    const [addGuestLoading, setAddGuestLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newGuestsList, setNewGuestsList] = useState([{ name: '', guestType: 'general', note: '' }]);
    const [isBulkAddMode, setIsBulkAddMode] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | null>(null);
    // State cho lọc & phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const guestsPerPage = 10;
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    // State cho hướng dẫn & xóa
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handlePasswordSubmit = () => {
        const inputHash = crypto.SHA256(password).toString();
        if (inputHash === SECRET_PASSWORD_HASH) {
            setIsAuthenticated(true);
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            localStorage.setItem(AUTH_KEY, JSON.stringify({
                auth: true,
                expiry: endOfDay.getTime()
            }));
            setPasswordError('');
            fetchGuestsFromSheet(); // aTải dữ liệu lần đầu sau khi xác thực
        } else {
            setPasswordError('Mật khẩu không đúng. Vui lòng thử lại.');
        }
    };

    const fetchGuestsFromSheet = async (useCache = true) => {
        setLoading(true);
        setError(null);

        if (useCache) {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (Date.now() - timestamp < CACHE_EXPIRY) {
                    setGuests(data);
                    setLoading(false);
                    return;
                }
                localStorage.removeItem(CACHE_KEY);
            }
        }

        try {
            const response = await fetch(`${APPS_SCRIPT_URL}?sheet=🔗 Link Khách Mời`);
            const data = await response.json();

            if (data.success) {
                // Sắp xếp dữ liệu theo timestamp mới nhất lên trên
                const sortedGuests = data.data.sort((a: Guest, b: Guest) => {
                    // Chuyển đổi timestamp thành Date object để so sánh
                    const dateA = new Date(a.timestamp);
                    const dateB = new Date(b.timestamp);
                    // Sắp xếp giảm dần (mới nhất lên đầu)
                    return dateB.getTime() - dateA.getTime();
                });

                setGuests(sortedGuests);

                // Lưu dữ liệu đã sắp xếp vào cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: sortedGuests,
                    timestamp: Date.now()
                }));
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách khách mời:', err);
            setError('Không thể tải danh sách khách mời. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedAuth = localStorage.getItem(AUTH_KEY);
        if (storedAuth) {
            const { auth, expiry } = JSON.parse(storedAuth);
            if (auth && Date.now() < expiry) {
                setIsAuthenticated(true);
                fetchGuestsFromSheet();
            } else {
                localStorage.removeItem(AUTH_KEY);
                setIsAuthenticated(false);
            }
        }
    }, []);

    // Hàm thêm/sửa một khách mời
   const handleSaveGuest = async () => {
    if (!newGuestName.trim()) {
        alert('Vui lòng nhập tên khách mời.');
        return;
    }
    setAddGuestLoading(true);
    setError(null);

    // Bắt đầu thay đổi ở đây 👇
    let guestLinkPrefix = urlPreview;
    if (newGuestType === 'parent') {
        guestLinkPrefix += 'p/';
    }
    const newLink = `${guestLinkPrefix}?name=${encodeURIComponent(newGuestName.trim())}`;
    // Kết thúc thay đổi ở đây 👆

    let bodyData: any = {};

    if (editingGuest) {
        bodyData = {
            action: "update",
            _id: editingGuest._id,
            name: newGuestName.trim(),
            guestType: newGuestType,
            link: newLink,
            note: newGuestNote.trim(),
        };
    } else {
        bodyData = {
            formType: "guest-link",
            name: newGuestName.trim(),
            guestType: newGuestType,
            link: newLink,
            note: newGuestNote.trim(),
        };
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        setTimeout(() => {
            fetchGuestsFromSheet(false);
            setNewGuestName('');
            setNewGuestNote('');
            setNewGuestType('general');
            setIsDrawerOpen(false);
            setEditingGuest(null);
            setPage(1);
            setAddGuestLoading(false);
        }, 1000);
        setAlertMessage(editingGuest ? 'Cập nhật thành công!' : 'Thêm khách mời thành công!');
        setAlertSeverity('success');
        await fetchGuestsFromSheet(false);

    } catch (err) {
        console.error('Lỗi khi lưu khách mời:', err);
        setError('Lưu khách mời thất bại.');
        setAddGuestLoading(false);
    }
};

  const handleBulkAddGuests = async () => {
    const validGuests = newGuestsList.filter(guest => guest.name.trim() !== '');
    if (validGuests.length === 0) {
        alert('Vui lòng nhập ít nhất một tên khách mời.');
        return;
    }

    setAddGuestLoading(true);
    setError(null);
    try {
        const postData = {
            formType: "guest-link-bulk",
            guests: validGuests.map(g => {
                // Bắt đầu thay đổi ở đây 👇
                let guestLinkPrefix = urlPreview;
                if (g.guestType === 'parent') {
                    guestLinkPrefix += 'p/';
                }
                return {
                    name: g.name.trim(),
                    link: `${guestLinkPrefix}?name=${encodeURIComponent(g.name.trim())}`,
                    guestType: g.guestType,
                    note: g.note || '',
                };
            }),
            // Kết thúc thay đổi ở đây 👆
        };

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        setTimeout(() => {
            fetchGuestsFromSheet(false);
            setIsDrawerOpen(false);
            setNewGuestsList([{ name: '', guestType: 'general', note: '' }]);
            setPage(1);
            setAddGuestLoading(false);
        }, 1000);
        <Alert severity="success">
            <AlertTitle>Thêm khách mời thành công!!</AlertTitle>
            Đang tải lại danh sách...
        </Alert>

    } catch (err) {
        console.error('Lỗi khi thêm nhiều khách mời:', err);
        setError('Thêm nhiều khách mời thất bại.');
        setAddGuestLoading(false);
    }
};

    const handleUpdateStatus = async (guestId: string, newStatus: 'pending' | 'sent') => {
        // Cập nhật state ngay lập tức để giao diện phản hồi nhanh
        const updatedGuests = guests.map(guest =>
            guest._id === guestId ? { ...guest, status: newStatus } : guest
        );
        setGuests(updatedGuests);

        // Cập nhật cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: updatedGuests, timestamp: Date.now() }));

        try {
            // Gửi yêu cầu API ngầm
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: "patch", _id: guestId, newStatus }),
            });
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            setError('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
            // Khôi phục lại state nếu có lỗi
            fetchGuestsFromSheet(false);
        }
    };

    // --- HÀM XÓA KHÁCH MỜI ---
    const handleConfirmDelete = (guestId: string) => {
        const guest = guests.find(g => g._id === guestId);
        if (guest) {
            setGuestToDelete(guest);
            setDeleteDialogOpen(true);
        }
    };

    const handleDeleteGuest = async () => {
        if (!guestToDelete) return;
        setDeleteDialogOpen(false);

        // Cập nhật state ngay lập tức
        const updatedGuests = guests.filter(guest => guest._id !== guestToDelete._id);
        setGuests(updatedGuests);
        setPage(1);

        // Cập nhật cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: updatedGuests, timestamp: Date.now() }));

        try {
            // Gửi yêu cầu xóa ngầm
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: "delete", _id: guestToDelete._id }),
            });
            alert('Xóa khách mời thành công!');
            <Alert severity="success">
                <AlertTitle>Xóa khách mời thành công!</AlertTitle>
                Đang tải lại danh sách...
            </Alert>
        } catch (err) {
            console.error('Lỗi khi xóa khách mời:', err);
            setError('Xóa khách mời thất bại.');
            // Khôi phục lại state nếu có lỗi
            fetchGuestsFromSheet(false);
        }
    };

    // --- HÀM CHỈNH SỬA KHÁCH MỜI ---
    const handleEditGuest = (guest: Guest) => {
        setEditingGuest(guest);
        setNewGuestName(guest.name);
        setNewGuestNote(guest.note || '');
        setNewGuestType(guest.guestType);
        setIsDrawerOpen(true);
        setIsBulkAddMode(false);
    };

    const handleAddGuestRow = () => {
        setNewGuestsList([...newGuestsList, { name: '', guestType: 'general', note: '' }]);
    };

    const handleRemoveGuestRow = (index: number) => {
        const list = [...newGuestsList];
        if (list.length > 1) {
            list.splice(index, 1);
            setNewGuestsList(list);
        }
    };

    const handleGuestListChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: string) => {
        const list = [...newGuestsList];
        switch (field) {
            case 'name':
                list[index].name = e.target.value;
                break;
            case 'guestType':
                list[index].guestType = e.target.value as 'bride' | 'groom' | 'general' | 'parent';
                break;
            case 'note':
                list[index].note = e.target.value;
                break;
            default:
                break;
        }
        setNewGuestsList(list);
    };

    const filteredGuests = useMemo(() => {
        let filtered = guests;
        if (filterStatus !== 'all') {
            filtered = filtered.filter(guest => guest.status === filterStatus);
        }
        if (searchTerm) {
            filtered = filtered.filter(guest =>
                guest.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [guests, searchTerm, filterStatus]);

    const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
    const currentGuests = useMemo(() => {
        const startIndex = (page - 1) * guestsPerPage;
        return filteredGuests.slice(startIndex, startIndex + guestsPerPage);
    }, [page, filteredGuests, guestsPerPage]);

    const totalGuests = guests.length;
    const sentGuests = guests.filter(g => g.status === 'sent').length;
    const pendingGuests = totalGuests - sentGuests;

    const toggleDrawer = (open: boolean) => () => {
        setIsDrawerOpen(open);
        if (!open) {
            setNewGuestName('');
            setNewGuestNote('');
            setNewGuestType('general');
            setNewGuestsList([{ name: '', guestType: 'general', note: '' }]);
            setIsBulkAddMode(false);
            setEditingGuest(null); // Reset trạng thái chỉnh sửa
        }
    };

    const drawerContent = (
        <Box sx={{ width: isMobile ? '100vw' : 400, p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                    {editingGuest ? 'Chỉnh sửa khách mời' : 'Thêm khách mời'}
                </Typography>
                <IconButton onClick={toggleDrawer(false)}>
                    <RemoveCircleOutlineIcon />
                </IconButton>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {!editingGuest && (
                <Stack direction="row" spacing={1} mb={2}>
                    <Button
                        variant={isBulkAddMode ? 'outlined' : 'contained'}
                        onClick={() => setIsBulkAddMode(false)}
                        fullWidth
                    >
                        Thêm một khách
                    </Button>
                    <Button
                        variant={isBulkAddMode ? 'contained' : 'outlined'}
                        onClick={() => setIsBulkAddMode(true)}
                        fullWidth
                    >
                        Thêm nhiều
                    </Button>
                </Stack>
            )}

            {!isBulkAddMode ? (
                <Stack spacing={2}>
                    <TextField
                        label="Tên khách mời"
                        variant="outlined"
                        size="small"
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Loại khách"
                        select
                        variant="outlined"
                        size="small"
                        value={newGuestType}
                        onChange={(e) => setNewGuestType(e.target.value as 'bride' | 'groom' | 'general' | 'parent')}
                        fullWidth
                    >
                        <MenuItem value="general">Chung</MenuItem>
                        <MenuItem value="bride">Khách cô dâu</MenuItem>
                        <MenuItem value="groom">Khách chú rể</MenuItem>
                        {/* <MenuItem value="parent">Khách ba mẹ</MenuItem> */}
                    </TextField>
                    <TextField
                        label="Ghi chú"
                        variant="outlined"
                        size="small"
                        value={newGuestNote}
                        onChange={(e) => setNewGuestNote(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleSaveGuest}
                        disabled={addGuestLoading || !newGuestName.trim()}
                        fullWidth
                    >
                        {addGuestLoading ? <CircularProgress size={24} /> : (editingGuest ? 'Cập nhật' : 'Thêm')}
                    </Button>
                </Stack>
            ) : (
                <Stack spacing={2}>
                    {newGuestsList.map((guest, index) => (
                        <Stack direction="row" spacing={1} alignItems="center" key={index}>
                            <TextField
                                label="Tên khách"
                                value={guest.name}
                                onChange={(e) => handleGuestListChange(e, index, 'name')}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="Loại khách"
                                select
                                value={guest.guestType}
                                onChange={(e) => handleGuestListChange(e, index, 'guestType')}
                                size="small"
                                sx={{ minWidth: 100 }}
                            >
                                <MenuItem value="general">Chung</MenuItem>
                                {/* <MenuItem value="parent">Ba mẹ</MenuItem> */}
                                <MenuItem value="bride">Cô dâu</MenuItem>
                                <MenuItem value="groom">Chú rể</MenuItem>
                            </TextField>
                            <IconButton color="primary" onClick={handleAddGuestRow}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                            {newGuestsList.length > 1 && (
                                <IconButton color="error" onClick={() => handleRemoveGuestRow(index)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            )}
                        </Stack>
                    ))}
                    <Button
                        onClick={handleBulkAddGuests}
                        variant="contained"
                        disabled={addGuestLoading || newGuestsList.every(g => g.name.trim() === '')}
                        fullWidth
                    >
                        {addGuestLoading ? <CircularProgress size={24} /> : 'Thêm danh sách'}
                    </Button>
                </Stack>
            )}
        </Box>
    );

    const mainContent = (
        <Box sx={{ flexGrow: 1, px: { xs: 0, md: 4, lg: 8 } }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent >
                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: "space-between",
                        alignItems: { xs: 'flex-start', md: 'center' }
                    }}>
                        <Box>
                            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">Danh sách khách mời</Typography>
                            <Typography variant="body1" color="text.secondary" mb={3}>
                                Thêm khách mời và tạo link cá nhân để họ có thể xác nhận tham dự.
                            </Typography>
                        </Box>

                        <Box sx={{ mb: { xs: 2, md: 0 } }}>
                            <Button
                                variant="outlined"
                                component="span"
                                sx={{ borderRadius: 2 }}
                                onClick={toggleDrawer(true)}>
                                Thêm khách
                            </Button>
                        </Box>
                    </Box>

                    <Paper elevation={0} sx={{ p: 1, mb: 1, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >
                            <TotalGuestsCard active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>
                                <Typography variant="h4" color="inherit" fontWeight="bold">{totalGuests}</Typography>
                                <Typography variant="caption" color="inherit" sx={{ mt: -0.5, fontSize: 8 }}>Tổng</Typography>
                            </TotalGuestsCard>
                            <TotalGuestsCard active={filterStatus === 'sent'} onClick={() => setFilterStatus('sent')}>
                                <Typography variant="h4" color="inherit" fontWeight="bold">{sentGuests}</Typography>
                                <Typography variant="caption" color="inherit" sx={{ mt: -0.5, fontSize: 8 }}>Đã gửi</Typography>
                            </TotalGuestsCard>
                            <TotalGuestsCard active={filterStatus === 'pending'} onClick={() => setFilterStatus('pending')}>
                                <Typography variant="h4" color="inherit" fontWeight="bold">{pendingGuests}</Typography>
                                <Typography variant="caption" color="inherit" sx={{ mt: -0.5, fontSize: 8 }}>Chưa gửi</Typography>
                            </TotalGuestsCard>
                        </Stack>
                    </Paper>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Tìm kiếm khách mời..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ p: 4 }}>
                            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={200} />
                            <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <>
                            <GuestTable
                                guests={currentGuests}
                                onEdit={handleEditGuest}
                                onDelete={handleConfirmDelete}
                                onUpdateStatus={handleUpdateStatus}
                            />
                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(event, value) => setPage(value)}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>

                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                    onClick={toggleDrawer(true)}
                >
                    <AddCircleOutlineIcon />
                </Fab>
            </Card>
        </Box>
    );

    const passwordPrompt = (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            px: 2,
            textAlign: 'center'
        }}>
            <Card sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Nhập Mật Khẩu
                </Typography>
                <TextField
                    label="Mật khẩu"
                    type="password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={password}
                    onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, ''); // loại bỏ ký tự không phải số
                        setPassword(onlyNums);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handlePasswordSubmit();
                        }
                    }}
                    error={!!passwordError}
                    helperText={passwordError}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // gợi ý bàn phím số trên mobile
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={handlePasswordSubmit}
                    fullWidth
                >
                    Truy cập
                </Button>
            </Card>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ p: 0 }}>
            {alertMessage && (
                <Alert
                    severity={alertSeverity || 'success'}
                    onClose={() => { setAlertMessage(null); setAlertSeverity(null); }}
                    sx={{ mb: 2 }}
                >
                    <AlertTitle>{alertMessage}</AlertTitle>
                </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.grey[100] }}>
                {/* Header */}
                <Box sx={{
                    p: 2,
                    mb: 4,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%)`,
                    color: '#fff',
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EmojiEventsIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
                            <Typography variant="h5" component="h1" fontWeight="bold">
                                Quản lý khách mời
                            </Typography>
                        </Stack>
                        <Button
                            variant="text"
                            sx={{ color: '#fff' }}
                            startIcon={<InfoIcon />}
                            onClick={() => setIsGuideOpen(true)}
                        >
                            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Hướng dẫn</Typography>
                        </Button>
                    </Stack>
                </Box>

                {/* Main Content or Password Prompt */}
                {isAuthenticated ? mainContent : passwordPrompt}

                {/* Footer */}
                <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: theme.palette.grey[200] }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <a href="https://mo-wedding.vercel.app/" style={{ textDecoration: 'none', color: theme.palette.text.secondary }}>
                            MoWedding
                        </a>{' '}
                        {new Date().getFullYear()}.
                    </Typography>
                </Box>

                {/* Drawer for adding/editing guests */}
                <Drawer
                    anchor={isMobile ? 'bottom' : 'right'}
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    {drawerContent}
                </Drawer>

                {/* Dialog for guide/tutorial */}
                <Dialog open={isGuideOpen} onClose={() => setIsGuideOpen(false)}>
                    <DialogTitle>Hướng dẫn sử dụng</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel>{step.label}</StepLabel>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography>{step.description}</Typography>
                                    </Box>
                                </Step>
                            ))}
                        </Stepper>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Quay lại
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button onClick={() => setIsGuideOpen(false)} variant="contained">
                                Hoàn thành
                            </Button>
                        ) : (
                            <Button onClick={handleNext} variant="contained">
                                Tiếp
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Hộp thoại xác nhận xóa */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Xác nhận xóa khách mời?</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">
                            Bạn có chắc chắn muốn xóa khách mời **{guestToDelete?.name}**? Hành động này không thể hoàn tác.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleDeleteGuest} color="error" autoFocus>
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};
export default WeddingStepGuests;