import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, clearMessage, clearSuccessMessage } from '../redux/slices/userSlice';
import { Box, Typography, Alert, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function VerifyEmailPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const successMessage = useSelector(state => state.user.successMessage);
    const error = useSelector(state => state.user.error);
    const loading = useSelector(state => state.user.loading);

    useEffect(() => {
        if (token) {
            console.log(token)
            dispatch(verifyEmail({ token }));
        }
        return () => {
            dispatch(clearMessage());
            dispatch(clearSuccessMessage());
        };
    }, [token, dispatch]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, px: 2 }}>
            <Typography variant="h5" mb={2}>Email Doğrulama</Typography>

            {loading && <CircularProgress />}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={() => dispatch(clearSuccessMessage())}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {successMessage},
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#1976d2',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            onClick={() => navigate("/authenticate")}
                        >
                            Giriş Yap.
                        </Typography>
                </Alert>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={() => dispatch(clearMessage())}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            )}
        </Box>
    );
}

export default VerifyEmailPage;
