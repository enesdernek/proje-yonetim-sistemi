import { Box, Button, CircularProgress, FormControl, FormHelperText, Input, InputAdornment, InputLabel, Typography, Alert, IconButton } from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordIcon from '@mui/icons-material/Password';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { authenticate, clearMessage, clearSuccessMessage, resendMailVerification } from '../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  email: yup.string().required("Email zorunludur").email("Geçerli email giriniz"),
  password: yup.string().required("Şifre zorunludur").min(8, "Şifre en az 8 karakter")
});

function Authenticate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const navigateToMailVerificationPage = ()=>{
        dispatch(clearMessage())
        dispatch(clearSuccessMessage())
        navigate("/resend-mail-verification")
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      dispatch(authenticate({ email: values.email, password: values.password }));
    }
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  

  return (
    <Box sx={{ height: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { md: "400px", xs: "350px" }, padding: 4, borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
          
          <Typography variant="h5" textAlign="center" mb={2}>Giriş Yap</Typography>

          <FormControl variant="standard">
            <InputLabel>Email</InputLabel>
            <Input
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              startAdornment={<InputAdornment position="start"><AlternateEmailIcon /></InputAdornment>}
            />
          </FormControl>
          {formik.touched.email && formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}

          <FormControl variant="standard">
            <InputLabel>Şifre</InputLabel>
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
            sx={{ mt: 2, paddingY: 1.5, fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}
          >
            {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : "Giriş Yap"}
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#1976d2',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#115293',
                },
              }}
              onClick={() => navigate("/password-reset")}
            >
              Şifremi Unuttum
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#1976d2',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#115293',
                },
              }}
              onClick={() => navigate("/register")}
            >
              Hesap Oluştur
            </Typography>
          </Box>


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
              {error.includes("Email doğrulanmamış kullanıcı") && (
                <Button
                  size="small"
                  variant='contained'
                  color="warning"
                  sx={{ mt: 2, textTransform: 'none' }}
                  onClick={()=>navigateToMailVerificationPage()}
                  
                  
                >
                  Doğrulama Mailini Yeniden Gönder
                </Button>
              )}
            </Alert>
          )}

          
        </Box>
      </form>
    </Box>
  );
}

export default Authenticate;
