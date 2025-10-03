import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
    Chip, Box, IconButton, Tooltip, Stack,
    Card as MuiCard, CardContent, useMediaQuery, useTheme, Divider, CircularProgress
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';
import DoneIcon from '@mui/icons-material/Done';
import { Guest } from 'src/types/linkguest';

// Định nghĩa kiểu dữ liệu cho một khách mời
// types.ts

// Định nghĩa kiểu dữ liệu cho props của component
interface GuestTableProps {
    guests: Guest[];
    onEdit: (guest: Guest) => void;
    onDelete: (guestId: string) => void;
    onUpdateStatus: (guestId: string, status: 'pending' | 'sent') => void;
}

const GuestTable: React.FC<GuestTableProps> = ({ guests, onEdit, onDelete, onUpdateStatus }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const handleCopyLink = (guestId: string, link: string) => {
        navigator.clipboard.writeText(link);
        setCopiedId(guestId);
        setTimeout(() => {
            setCopiedId(null);
        }, 2000); // 2 giây
    };

    const handleStatusChange = async (guestId: string, currentStatus: 'pending' | 'sent') => {
        // Chỉ cho phép cập nhật từ 'pending' sang 'sent'
        if (currentStatus === 'sent') return;

        setUpdatingStatusId(guestId);
        try {
            await onUpdateStatus(guestId, 'sent');
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            // Bạn có thể thêm alert hoặc Snackbar để thông báo lỗi
        } finally {
            setUpdatingStatusId(null);
        }
    };

    if (isMobile) {
        return (
            <Box sx={{ mt: 2 }}>
                {guests.length > 0 ? (
                    guests.map((guest) => (
                        <MuiCard key={guest._id} sx={{ mb: 1, boxShadow: 1 }}>
                            <CardContent>
                                {/* Tên khách và loại khách */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Tên khách mời: {guest.name}</Typography>
                                    <Chip
                                        label={
                                            guest.guestType === 'bride'
                                                ? 'Cô dâu'
                                                : guest.guestType === 'groom'
                                                    ? 'Chú rể'
                                                    : guest.guestType === 'parent'
                                                        ? 'Ba mẹ'
                                                        : 'Chung'
                                        }
                                        color={
                                            guest.guestType === 'bride'
                                                ? 'info'
                                                : guest.guestType === 'groom'
                                                    ? 'primary'
                                                    : guest.guestType === 'parent'
                                                        ? 'warning' // You can choose a different color here
                                                        : 'secondary'
                                        }
                                        size="small"
                                        variant="outlined"
                                    />
                                </Stack>
                                <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                                {/* Link cá nhân */}
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Link cá nhân:</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                                        <Typography variant="caption" color="text.primary" noWrap>
                                            {decodeURIComponent(guest.link).replace(/%20/g, ' ')}
                                        </Typography>
                                        {/* <Tooltip title="Sao chép link">
                                            <IconButton size="small" onClick={() => handleCopyLink(decodeURIComponent(guest.link).replace(/%20/g, ' '))}>
                                                <FileCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip> */}
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCopyLink(guest._id, guest.link)}
                                        >
                                            {copiedId === guest._id ? (
                                                <Tooltip title="Đã sao chép link">
                                                    <DoneIcon fontSize="small" color="success" />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Sao chép link">
                                                    <FileCopyIcon fontSize="small" />
                                                </Tooltip>
                                            )}
                                        </IconButton>

                                        <Tooltip title="Mở link">
                                            <IconButton size="small" href={guest.link} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                                <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                                  {/* <Box sx={{ mb: 1 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Thời gian mời:</Typography>
                                        {updatingStatusId === guest._id ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                           <Chip
                                        label={guest.inviteTime || '-'}
                                        color={guest.inviteTime === '18h' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                        )}
                                    </Stack>
                                </Box> */}
                                <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
                                    {/* THÊM MỚI: Hiển thị thời gian mời */}
                                
                                {/* Trạng thái */}
                                <Box sx={{ mb: 1 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Trạng thái:</Typography>
                                        {updatingStatusId === guest._id ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <Chip
                                                label={guest.status === 'pending' ? 'Chưa gửi' : 'Đã gửi'}
                                                color={guest.status === 'sent' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                </Box>
                              
                                   
                                <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                                {/* Ghi chú */}
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Ghi chú: <Typography component="span" variant="caption">{guest.note || '-'}</Typography>
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                                {/* Hành động */}
                                <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
                                             {guest.status !== 'sent' && (
                                                <>

                                    <Tooltip title="Sửa">
                                        <IconButton size="small" onClick={() => onEdit(guest)} color="primary"

                                        >
                                            <EditIcon fontSize="small"

                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton size="small" onClick={() => onDelete(guest._id)} color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    </>
                                             )}
                                    {updatingStatusId === guest._id ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <Tooltip title={guest.status === 'sent' ? 'Đã gửi' : 'Xác nhận đã gửi'}>
                                            <IconButton
                                                onClick={() => handleStatusChange(guest._id, guest.status)}
                                                disabled={guest.status === 'sent'}
                                                size="small"
                                                color="success"
                                            >
                                                {guest.status === 'sent' ? <SendIcon fontSize="small" /> : <ScheduleIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Stack>
                            </CardContent>
                        </MuiCard>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography color="text.secondary">Chưa có khách mời nào</Typography>
                    </Box>
                )}
            </Box>
        );
    }

    // Giao diện cho Desktop: Hiển thị dưới dạng Table truyền thống
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Tên khách</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Khách của nhà</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Link cá nhân</TableCell>
                        {/* <TableCell sx={{ fontWeight: 600 }}>Thời gian mời</TableCell> */}
                        <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {guests.length > 0 ? (
                        guests.map((guest) => (
                            <TableRow key={guest._id}>
                                <TableCell>{guest.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            guest.guestType === 'bride'
                                                ? 'Cô dâu'
                                                : guest.guestType === 'groom'
                                                    ? 'Chú rể'
                                                    : guest.guestType === 'parent'
                                                        ? 'Ba mẹ'
                                                        : 'Chung'
                                        }
                                        color={
                                            guest.guestType === 'bride'
                                                ? 'info'
                                                : guest.guestType === 'groom'
                                                    ? 'primary'
                                                    : guest.guestType === 'parent'
                                                        ? 'warning' // You can choose a different color here
                                                        : 'secondary'
                                        }
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 300 }}>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {/* Vẫn giữ nguyên để hiển thị tên dễ đọc cho người dùng */}
                                            {decodeURIComponent(guest.link).replace(/%20/g, ' ')}
                                        </Typography>
                                        <Tooltip title="Sao chép link">
                                            <IconButton
                                                size="small"
                                                // Thay đổi tại đây: Truyền guest.link gốc vào hàm handleCopyLink
                                                onClick={() => handleCopyLink(guest._id, guest.link)}
                                            >
                                                <FileCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Mở link">
                                            <IconButton size="small" href={guest.link} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                                 {/* <TableCell> 
                                    <Chip
                                        label={guest.inviteTime || '-'}
                                        color={guest.inviteTime === '18h' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell> */}
                                <TableCell>{guest.note || '-'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {updatingStatusId === guest._id ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <Chip
                                                label={guest.status === 'sent' ? 'Đã Gửi' : 'Chưa Gửi'}
                                                color={guest.status === 'sent' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                             {guest.status !== 'sent' && (
                                                <>
                                        <Tooltip title="Sửa">
                                            <IconButton size="small" onClick={() => onEdit(guest)} color="primary">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton size="small" onClick={() => onDelete(guest._id)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                                </>
                                             )}
                                        {updatingStatusId === guest._id ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <Tooltip title={guest.status === 'sent' ? 'Đã gửi' : 'Xác nhận đã gửi'}>
                                                <IconButton
                                                    onClick={() => handleStatusChange(guest._id, guest.status)}
                                                    disabled={guest.status === 'sent'}
                                                    size="small"
                                                    color="success"
                                                >
                                                    {guest.status === 'sent' ? <SendIcon fontSize="small" /> : <ScheduleIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography color="text.secondary">Chưa có khách mời nào</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default GuestTable;