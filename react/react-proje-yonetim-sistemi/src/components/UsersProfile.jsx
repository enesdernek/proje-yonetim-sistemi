import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    CircularProgress,
    Divider,
    Stack,
    Button
} from "@mui/material";

import { getUserByUserId } from "../redux/slices/userSlice";
import { isConnected, deleteConnection } from "../redux/slices/connectionSlice";
import { createConnectionRequest, deleteConnectionRequest } from "../redux/slices/connectionRequestSlice";

function UsersProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.user.token);
    const viewedUser = useSelector((state) => state.user.viewedUser);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);
    const user = useSelector((state) => state.user.user);

    const isConnectedMap = useSelector((state) => state.connection.isConnectedMap);
    const connectionLoading = useSelector((state) => state.connection.loading);

    const sendedRequests = useSelector((state) => state.connectionRequest.sendedConnectionRequests);
    const requestLoading = useSelector((state) => state.connectionRequest.loading);

    const isConn = isConnectedMap[userId];

    // Pending request backend state'e göre belirleniyor
    const pendingRequestFromStore = sendedRequests.find(
        (req) => req.receiverId === Number(userId) && req.status === "PENDING"
    );

    const [localPending, setLocalPending] = useState(false);

    useEffect(() => {
        if (userId && token) {
            dispatch(getUserByUserId({ userId, token }));
            dispatch(isConnected({ otherUserId: userId, token }));
        }
    }, [userId, token]);

    useEffect(() => {
        setLocalPending(!!pendingRequestFromStore); // sadece backend'de PENDING varsa true
    }, [pendingRequestFromStore]);

    const handleConnect = () => {
        if (!token || !userId) return;

        const connectionRequestDtoIU = { receiverId: Number(userId) };
        dispatch(createConnectionRequest({ token, connectionRequestDtoIU }));
    };

    const handleDeleteRequest = () => {
        if (!token || !pendingRequestFromStore) return;

        dispatch(deleteConnectionRequest({ token, requestId: pendingRequestFromStore.requestId }))
            .unwrap()
            .catch((err) => {
                if (err === "İstek önceden kabul edilmiş" || err === "İstek önceden reddedilmiş") {
                    // UI'yi approved/rejected duruma göre güncelle
                    setLocalPending(false);
                }
            });
    };

    const handleRemoveConnection = () => {
        if (!token || !userId) return;
        dispatch(deleteConnection({ otherUserId: Number(userId), token }));
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" textAlign="center" mt={3}>
                {error}
            </Typography>
        );
    }

    if (!viewedUser) {
        return (
            <Typography textAlign="center" mt={3}>
                Kullanıcı bulunamadı.
            </Typography>
        );
    }

    const isOwnProfile = user?.userId === viewedUser.userId;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5, px: 2 }}>
            <Card sx={{ width: "100%", maxWidth: 420, p: 2, borderRadius: 3 }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Avatar
                            src={viewedUser.profileImageUrl || ""}
                            sx={{ width: 90, height: 90, fontSize: 40 }}
                        >
                            {!viewedUser.profileImageUrl &&
                                viewedUser.username?.charAt(0)?.toUpperCase()}
                        </Avatar>
                    </Box>

                    <Typography variant="h5" textAlign="center" fontWeight="600">
                        {viewedUser.username}
                    </Typography>

                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Üye No: {viewedUser.userId}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Box>
                            <Typography fontWeight="600">Email</Typography>
                            <Typography color="text.secondary">{viewedUser.email}</Typography>
                        </Box>

                        <Box>
                            <Typography fontWeight="600">Kayıt Tarihi</Typography>
                            <Typography color="text.secondary">
                                {new Date(viewedUser.createdAt).toLocaleDateString("tr-TR")}
                            </Typography>
                        </Box>
                    </Stack>

                    {!isOwnProfile && (
                        <Box sx={{ textAlign: "center" }}>
                            {(connectionLoading || requestLoading) ? (
                                <CircularProgress size={28} />
                            ) : isConn === true ? (
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button variant="contained" color="success" disabled sx={{ opacity: 0.6 }}>
                                        Bağlantı Var
                                    </Button>
                                    <Button variant="contained" color="error" onClick={handleRemoveConnection}>
                                        Bağlantıyı Kaldır
                                    </Button>
                                </Stack>
                            ) : localPending ? (
                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        disabled
                                        variant="contained"
                                        sx={{
                                            backgroundColor: (theme) => theme.palette.success.main + " !important",
                                            color: "#fff !important",
                                            opacity: 0.7,
                                        }}
                                    >
                                        İstek Gönderildi
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteRequest}
                                        disabled={!pendingRequestFromStore} // sadece PENDING istek
                                    >
                                        İsteği İptal Et
                                    </Button>
                                </Stack>
                            ) : (
                                <Button variant="contained" color="primary" onClick={handleConnect}>
                                    Bağlantı Kur
                                </Button>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default UsersProfile;
