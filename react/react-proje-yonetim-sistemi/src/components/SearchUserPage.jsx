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
import { isConnected } from "../redux/slices/connectionSlice";
import { useNavigate } from "react-router-dom";

function SearchUserPage() {
    const [searchInput, setSearchInput] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userList = useSelector((state) => state.user?.userList || []);
    const token = useSelector((state) => state.user.token);
    const isConnectedMap = useSelector(state => state.connection.isConnectedMap) || {};

    const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

    const handleSearch = () => {
        if (searchInput.trim() === "") return;
        dispatch(searchUser({ searchInput, token }));
    };

    useEffect(() => {
        if (userList.length > 0) {
            userList.forEach((u) => {
                dispatch(isConnected({ otherUserId: u.userId, token }));
            });
        }
    }, [userList]);

    useEffect(()=>{
        dispatch(clearUserList());
    },[navigate])

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
            {userList.length === 0 ? (
                <Typography sx={{ mt: 2, color: "gray" }}>
                    Arama sonucu bulunamadı.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {userList.map((user) => {
                        const isConn = isConnectedMap[user.userId];

                        return (
                            <Card key={user.userId} sx={{ p: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        src={
                                            user.profileImageUrl
                                                ? BASE_URL + user.profileImageUrl
                                                : undefined
                                        }
                                        alt={user.username}
                                        sx={{ width: 48, height: 48, fontSize: 26 }}
                                    >
                                        {user.username?.slice(0, 2)?.toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {user.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </Box>

                                    {/* Profile Git */}
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/users-profile/${user.userId}`)}
                                    >
                                        Profile Bak
                                    </Button>

                                    {/* Bağlantı Durumu */}
                                    {isConn === undefined ? (
                                        <Button variant="contained" disabled>
                                            Kontrol ediliyor...
                                        </Button>
                                    ) : isConn ? (
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
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => alert("Bağlantı isteği gönderildi!")}
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
