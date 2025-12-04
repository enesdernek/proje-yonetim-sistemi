import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Stack,
    Divider,
    Button,
    CircularProgress,
    Pagination,
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

    useEffect(() => {
        if (userId && token) {
            dispatch(getConnectionsPaged({ userId, token, pageNo: page, pageSize: 10 }));
        }
    }, [dispatch, userId, token, page]);

    const handleRemoveConnection = (otherUserId) => {
        dispatch(deleteConnection({ otherUserId, token }))
            .unwrap()
            .then(() => {
                dispatch(getConnectionsPaged({ userId, token, pageNo: page, pageSize: 10 }));
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
            <Typography textAlign="center" mt={5}>
                Bağlantı bulunamadı.
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Stack spacing={2}>
                {connections.map(conn => (
                    <Card key={conn.connectionId}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/users-profile/${conn.connectedUserId}`)}>
                                <Avatar
                                    src={conn.connectedUsersProfileImageUrl ? BASE_URL + conn.connectedUsersProfileImageUrl : undefined}
                                    sx={{ width: 50, height: 50 }}
                                >
                                    {conn.connectedUsername?.slice(0, 2)?.toUpperCase()}
                                </Avatar>
                                <Stack>
                                    <Typography variant="body1" fontWeight={600}>{conn.connectedUsername}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Üye No: {conn.connectedUserId}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Button variant="contained" color="error" onClick={() => handleRemoveConnection(conn.connectedUserId)}>
                                Bağlantıyı Kaldır
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
            )}
        </Box>
    );
}
