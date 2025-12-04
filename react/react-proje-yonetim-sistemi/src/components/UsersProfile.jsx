import React, { useEffect } from "react";
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
import { isConnected } from "../redux/slices/connectionSlice";

function UsersProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.user.token);
    const viewedUser = useSelector((state) => state.user.viewedUser);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);

    const isConnectedMap = useSelector((state) => state.connection.isConnectedMap);
    const connectionLoading = useSelector((state) => state.connection.loading);

    const isConn = isConnectedMap[userId]; // bağlantı durumu

    useEffect(() => {
        if (userId && token) {
            dispatch(getUserByUserId({ userId, token }));
        }
    }, [userId, token]);

    useEffect(() => {
        if (userId && token) {
            dispatch(isConnected({ otherUserId: userId, token }));
        }
    }, [userId, token]);

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

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5, px: 2 }}>
            <Card sx={{ width: "100%", maxWidth: 420, p: 2, borderRadius: 3 }}>
                <CardContent>

                    {/* Avatar */}
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

                    {/* Bilgiler */}
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

                    {/* Bağlantı Durumu */}
                    <Box sx={{ textAlign: "center" }}>
                        {connectionLoading ? (
                            <CircularProgress size={28} />

                        ) : isConn === true ? (
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled
                                    sx={{
                                        backgroundColor: (theme) => theme.palette.success.main + " !important",
                                        color: "#fff !important",
                                        opacity: 0.6, // disable efekti
                                    }}
                                >
                                    Bağlantı Var
                                </Button>

                                <Button variant="contained" color="error">
                                    Bağlantıyı Kaldır
                                </Button>
                            </Stack>

                        ) : isConn === false ? (
                            <Button variant="contained" color="primary">
                                Bağlantı Kur
                            </Button>

                        ) : (
                            <Button variant="contained" disabled>
                                Kontrol Ediliyor...
                            </Button>
                        )}
                    </Box>

                </CardContent>
            </Card>
        </Box>
    );
}

export default UsersProfile;
