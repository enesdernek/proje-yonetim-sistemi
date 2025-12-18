import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Typography,
    Card,
    Stack,
    Avatar,
    Button,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { clearUserList, searchUser } from "../redux/slices/userSlice";
import { isConnected, deleteConnection } from "../redux/slices/connectionSlice";
import { createConnectionRequest, deleteConnectionRequest } from "../redux/slices/connectionRequestSlice";
import { useNavigate } from "react-router-dom";

function SearchUserPage() {
    const [searchInput, setSearchInput] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userList = useSelector((state) => state.user?.userList || []);
    const token = useSelector((state) => state.user.token);
    const user = useSelector((state) => state.user.user)
    const isConnectedMap = useSelector((state) => state.connection.isConnectedMap) || {};
    const connectionLoading = useSelector((state) => state.connection.loading);
    const requestLoading = useSelector((state) => state.connectionRequest.loading);
    const sendedRequests = useSelector((state) => state.connectionRequest.sendedConnectionRequests);
    const authUserId = useSelector((state) => state.user.user?.userId);



    const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

    const handleSearch = () => {
        if (searchInput.trim() === "") return;
        dispatch(searchUser({ searchInput, token }));
    };

    // Her kullanıcı için bağlantı durumunu getir
    useEffect(() => {
        if (userList.length > 0) {
            userList.forEach((u) => {
                dispatch(isConnected({ otherUserId: u.userId, token }));
            });
        }
    }, [userList, token, dispatch]);

    // Navigasyon değişince listeyi temizle
    useEffect(() => {
        dispatch(clearUserList());
    }, [navigate, dispatch]);

    return (
        <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Kullanıcı Ara
            </Typography>

            {/* Search Input */}
            <Stack direction="row" spacing={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Kullanıcı adı ara..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                >
                    Ara
                </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Liste */}
            {userList.filter(user => user.userId !== authUserId).length === 0 ? (
                <Typography sx={{ mt: 2, color: "gray" }}>
                    Arama sonucu bulunamadı.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {userList
                        .filter((user) => user.userId !== authUserId)
                        .map((user) => {
                            const isConn = isConnectedMap[user.userId]; // burada tanımla
                            const updatedPendingRequest = sendedRequests.find(req => req.receiverId === user.userId);
                            const showPending = updatedPendingRequest && !isConn;

                            return (
                                <Card key={user.userId} sx={{ p: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar
                                            src={user.profileImageUrl ? BASE_URL + user.profileImageUrl : undefined}
                                            alt={user.username}
                                            sx={{ width: 48, height: 48, fontSize: 26, cursor: 'pointer' }}
                                            onClick={() => navigate(`/users-profile/${user.userId}`)}
                                        >
                                            {user.username?.slice(0, 2)?.toUpperCase()}
                                        </Avatar>

                                        <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/users-profile/${user.userId}`)}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {user.username}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </Box>

                                        {/* Bağlantı Durumu */}
                                        {(connectionLoading || requestLoading) ? (
                                            <Button variant="contained" disabled>
                                                Yükleniyor...
                                            </Button>
                                        ) : isConn ? (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={async () => {
                                                    await dispatch(deleteConnection({ otherUserId: user.userId, token })).unwrap();

                                                    dispatch(isConnected({ otherUserId: user.userId, token }));

                                                    const pendingReq = sendedRequests.find(req => req.receiverId === user.userId);
                                                    if (pendingReq) {
                                                        dispatch(deleteConnectionRequest({ token, requestId: pendingReq.requestId }));
                                                    }
                                                }}
                                            >
                                                Bağlantıyı Kaldır
                                            </Button>
                                        ) : showPending ? (
                                            <Stack direction="row" spacing={1}>
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
                                                    onClick={async () => {
                                                        await dispatch(deleteConnectionRequest({ token, requestId: updatedPendingRequest.requestId })).unwrap();
                                                        dispatch(isConnected({ otherUserId: user.userId, token }));
                                                    }}
                                                >
                                                    İsteği İptal Et
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={async () => {
                                                    await dispatch(createConnectionRequest({ token, connectionRequestDtoIU: { receiverId: user.userId } })).unwrap();
                                                    dispatch(isConnected({ otherUserId: user.userId, token }));
                                                }}
                                            >
                                                Bağlantı Kur
                                            </Button>
                                        )}
                                    </Stack>
                                </Card>
                            );
                        })}

                </Stack>
            )}
        </Box>
    );
}

export default SearchUserPage;
