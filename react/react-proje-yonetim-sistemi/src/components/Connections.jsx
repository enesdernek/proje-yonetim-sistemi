import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Stack,
    Button,
    CircularProgress,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectionsPaged, deleteConnection } from '../redux/slices/connectionSlice';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export default function Connections() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.user.token);
    const userId = useSelector(state => state.user.user?.userId);

    const { connections, totalPages, loading } = useSelector(state => state.connection);

    const [page, setPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState(null);

    useEffect(() => {
        if (userId && token) {
            dispatch(getConnectionsPaged({ userId, token, pageNo: page, pageSize: 10 }));
        }
    }, [dispatch, userId, token, page]);

    const handleOpenDialog = (conn) => {
        setSelectedConnection(conn);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedConnection(null);
    };

    const handleConfirmRemove = () => {
        if (!selectedConnection) return;

        dispatch(deleteConnection({ otherUserId: selectedConnection.connectedUserId, token }))
            .unwrap()
            .then(() => {
                dispatch(getConnectionsPaged({ userId, token, pageNo: page, pageSize: 10 }));
                handleCloseDialog();
            });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (connections.length === 0) {
        return (
            <Typography textAlign="center" mt={5} variant="h6">
                Bağlantı bulunamadı.
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center" color="primary">
                Bağlantılarım
            </Typography>

            <Stack spacing={2}>
                {connections.map(conn => (
                    <Card
                        key={conn.connectionId}
                        sx={{
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{ cursor: 'pointer', flex: 1 }}
                                onClick={() => navigate(`/users-profile/${conn.connectedUserId}`)}
                            >
                                <Avatar
                                    src={conn.connectedUsersProfileImageUrl ? BASE_URL + conn.connectedUsersProfileImageUrl : undefined}
                                    sx={{ width: 60, height: 60, border: '2px solid #1976d2' }}
                                >
                                    {conn.connectedUsername?.slice(0, 2)?.toUpperCase()}
                                </Avatar>
                                <Stack>
                                    <Typography variant="h6" fontWeight={600}>
                                        {conn.connectedUsername}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Üye No: {conn.connectedUserId}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ ml: 2 }}
                                onClick={() => handleOpenDialog(conn)}
                            >
                                Bağlantıyı Kaldır
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Bağlantıyı Kaldır</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedConnection?.connectedUsername} ile olan bağlantınızı kaldırmak istediğinizden emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Vazgeç</Button>
                    <Button onClick={handleConfirmRemove} color="error" variant="contained">Onayla</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
