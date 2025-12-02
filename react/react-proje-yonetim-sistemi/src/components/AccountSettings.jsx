import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthenticatedUser } from "../redux/slices/userSlice";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Button,
    Divider,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            dispatch(getAuthenticatedUser({ token }));
        }
    }, [dispatch, token]);

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
                Hesap Ayarları
            </Typography>

            {user && (
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Kullanıcı Adı:
                                </Typography>
                                <Typography variant="body1">{user.username}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={600}>
                                    E-posta:
                                </Typography>
                                <Typography variant="body1">{user.email}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Telefon:
                                </Typography>
                                <Typography variant="body1">{user.phone}</Typography>
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<EmailIcon />}
                                sx={{
                                    py: 1.2,
                                    textTransform: "capitalize"
                                }}
                                onClick={()=>navigate("/change-email-adress")}
                            >
                                Email Adresini Değiştir
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                startIcon={<LockIcon />}
                                sx={{
                                    py: 1.2,
                                    textTransform: "capitalize"
                                }}
                                onClick={()=>navigate("/change-password")}
                            >
                                Şifreni Değiştir
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                startIcon={<ManageAccountsIcon />}
                                sx={{
                                    py: 1.2,
                                    textTransform: "capitalize"
                                }}
                            >
                                Hesap Bilgilerini Değiştir
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
