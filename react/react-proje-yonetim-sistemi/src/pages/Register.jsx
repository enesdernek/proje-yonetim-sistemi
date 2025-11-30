import {
    Box, Button, Checkbox, CircularProgress, FormControl,
    FormControlLabel, FormHelperText, Input, InputAdornment,
    InputLabel, Typography, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';

import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { authenticate, clearMessage, clearSuccessMessage, register } from '../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
    username: yup.string()
        .required("İsim bilgisi zorunludur")
        .min(2, "İsim en az 2 karakter içermelidir")
        .max(32, "İsim 32 karakterden fazla olamaz")
        .matches(/^[^\d]*$/, "İsim sayısal karakter içeremez"),

    email: yup.string().required("Email adresi zorunludur").email("Geçerli bir email adresi giriniz"),

    password: yup.string()
        .required("Şifre zorunludur")
        .min(8, "Şifre en az 8 karakterden oluşmalıdır")
        .max(128, "Şifre 128 karakterden fazla içeremez"),

    passwordCheck: yup.string()
        .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
        .required('Şifre tekrarı zorunludur'),

    phone: yup.string()
        .required("Telefon numarası zorunludur.")
        .matches(/^[0-9]+$/, "Telefon numarası sadece rakamlardan oluşmalıdır")
        .length(10, "Telefon numarası 10 haneli olmalıdır"),

    address: yup.string().required("Adres bilgisi gereklidir"),

    term: yup.boolean().oneOf([true], "Şartları kabul etmelisiniz")
});

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);


    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            passwordCheck: "",
            phone: "",
            address: "",
            createdAt: new Date(),
            term: false,
        },
        validationSchema: validationSchema,

        onSubmit: async (values) => {
            const user = {
                username: values.username,
                email: values.email,
                password: values.password,
                phone: values.phone,
                address: values.address,
            };

            try {
                // REGISTER → throw yakalar
                await dispatch(register(user)).unwrap();

                navigate("/register-approved");

            } catch (error) {
                // HATA ALINCA BURAYA GELİR
                console.log("Register Error:", error);
            }
        }
    });


    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

     useEffect(() => {
            dispatch(clearSuccessMessage());
            dispatch(clearMessage());
        }, []);



    return (
        <Box
            sx={{
                height: 'auto',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                mt:2
                
            }}
        >
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: { md: "400px", xs: "350px" },
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        backgroundColor: 'white',
                    }}
                >

                    <Typography variant="h5" textAlign="center" mb={2}>
                        Hesap Oluştur
                    </Typography>

                    {/* İsim */}
                    <FormControl variant="standard">
                        <InputLabel>İsim</InputLabel>
                        <Input
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <DriveFileRenameOutlineIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {formik.touched.username && formik.errors.username && (
                        <FormHelperText error>{formik.errors.username}</FormHelperText>
                    )}



                    {/* Email */}
                    <FormControl variant="standard">
                        <InputLabel>Email</InputLabel>
                        <Input
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <AlternateEmailIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {formik.touched.email && formik.errors.email && (
                        <FormHelperText error>{formik.errors.email}</FormHelperText>
                    )}

                    {/* Şifre */}
                    <FormControl variant="standard">
                        <InputLabel>Şifre</InputLabel>
                        <Input
                            name="password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {formik.touched.password && formik.errors.password && (
                        <FormHelperText error>{formik.errors.password}</FormHelperText>
                    )}

                    {/* Şifre tekrar */}
                    <FormControl variant="standard">
                        <InputLabel>Şifre Tekrar</InputLabel>
                        <Input
                            name="passwordCheck"
                            type="password"
                            value={formik.values.passwordCheck}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordCheck && Boolean(formik.errors.passwordCheck)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {formik.touched.passwordCheck && formik.errors.passwordCheck && (
                        <FormHelperText error>{formik.errors.passwordCheck}</FormHelperText>
                    )}

                    {/* Telefon */}
                    <FormControl variant="standard">
                        <InputLabel>Telefon</InputLabel>
                        <Input
                            name="phone"
                            type="text"
                            value={formik.values.phone}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue("phone", numericValue);
                            }}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <PhoneIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {formik.touched.phone && formik.errors.phone && (
                        <FormHelperText error>{formik.errors.phone}</FormHelperText>
                    )}

                    {/* Adres */}
                    <FormControl variant="standard">
                        <InputLabel>Adres</InputLabel>
                        <Input
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <BusinessIcon />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {formik.touched.address && formik.errors.address && (
                        <FormHelperText error>{formik.errors.address}</FormHelperText>
                    )}

                    {/* Şartlar */}
                    <FormControl error={formik.touched.term && Boolean(formik.errors.term)}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.term}
                                    onChange={formik.handleChange}
                                    name="term"
                                />
                            }
                            label="Şartları kabul ediyorum"
                        />
                        {formik.touched.term && formik.errors.term && (
                            <FormHelperText>{formik.errors.term}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Submit Butonu */}
                    <Button
                        variant="contained"
                        type="submit"
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
                            "Hesap Oluştur"
                        )}
                    </Button>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
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

                    {/* Link */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#1976d2',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            onClick={() => navigate("/authenticate")}
                        >
                            Zaten bir hesabım var
                        </Typography>
                    </Box>

                </Box>
            </form>
        </Box>
    );
}

export default Register;
