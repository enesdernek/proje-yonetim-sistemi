import { Alert, Box, Button, CircularProgress, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from "yup";
import PasswordIcon from '@mui/icons-material/Password';
import { clearMessage, clearSuccessMessage, resetPassword, resetPasswordMail } from '../redux/slices/userSlice';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const validationSchema = yup.object({
    password: yup.string().required("Şifre zorunludur").min(8, "Şifre en az 8 karakter")
});


function ResetPasswordResponsePage() {


    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);
    const successMessage = useSelector((state) => state.user.successMessage);


    const formik = useFormik({
        initialValues: { password: "" },
        validationSchema,
        onSubmit: (values) => {
            dispatch(resetPassword({ newPassword: values.password, token: token }));
        }
    });

    useEffect(() => {
        dispatch(clearSuccessMessage());
        dispatch(clearMessage());
    }, []);

    return (
        <Box sx={{ height: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { md: "400px", xs: "350px" }, padding: 4, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>

                    <Typography variant="h5" textAlign="center" mb={2}>Şifremi Unuttum</Typography>

                    <FormControl variant="standard">
                        <InputLabel>Yeni Şifre</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            startAdornment={<InputAdornment position="start"><PasswordIcon /></InputAdornment>}
                        />
                    </FormControl>
                    {formik.touched.password && formik.errors.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}

                    <Button
                        variant="contained"
                        type="submit"
                        color="warning"
                        sx={{
                            mt: 2,
                            paddingY: 1.5,
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress size={32} sx={{ color: "white" }} />
                            </Box>
                        ) : (
                            "Şifreyi Sıfırla"
                        )}
                    </Button>

                    {successMessage && (
                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => dispatch(clearSuccessMessage())}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {successMessage}{" "}
                            <Typography
                                component="span"
                                sx={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    ml: 1,
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate("/authenticate")}
                            >
                                Giriş Yap
                            </Typography>
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2, display: "flex", alignItems: "center" }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => dispatch(clearMessage())}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                </Box>
            </form>
        </Box>
    )
}

export default ResetPasswordResponsePage